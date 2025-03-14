/*
 * sv_subscriber_example.c
 *
 * Example program for Sampled Values (SV) subscriber
 *
 */

#include "hal_thread.h"
#include <signal.h>
#include <stdio.h>
#include <sqlite3.h>
#include "sv_subscriber.h"


static bool running = true;
char dbPath[128] = "../../../GUI/PHPserver/dbHandler/SGData.db";
int msgCount = 100;
int ied_num = 0; 

void sigint_handler(int signalId)
{
    running = 0;
}

void updateSvDb(float data0,float data1){
    sqlite3 *db;
    sqlite3_stmt *res;
    char *err_msg = 0;
    
    int rc = sqlite3_open(dbPath, &db);
    if (rc != SQLITE_OK) {
        
        fprintf(stderr, "Cannot open database: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        
        return;
    }

    char sql[128]; 
    sprintf(sql,"UPDATE SV SET data0=%f,data1=%f WHERE id=%d",data0,data1,ied_num);

    rc = sqlite3_exec(db, sql, 0, 0, &err_msg);
    sqlite3_close(db);
    
}


/* Callback handler for received SV messages */
static void
svUpdateListener (SVSubscriber subscriber, void* parameter, SVSubscriber_ASDU asdu)
{
    printf("svUpdateListener called\n");

    const char* svID = SVSubscriber_ASDU_getSvId(asdu);

    if (svID != NULL)
        printf("  svID=(%s)\n", svID);

    printf("  smpCnt: %i\n", SVSubscriber_ASDU_getSmpCnt(asdu));
    printf("  confRev: %u\n", SVSubscriber_ASDU_getConfRev(asdu));

    /*
     * Access to the data requires a priori knowledge of the data set.
     * For this example we assume a data set consisting of FLOAT32 values.
     * A FLOAT32 value is encoded as 4 bytes. You can find the first FLOAT32
     * value at byte position 0, the second value at byte position 4, the third
     * value at byte position 8, and so on.
     *
     * To prevent damages due configuration, please check the length of the
     * data block of the SV message before accessing the data.
     */
    if (SVSubscriber_ASDU_getDataSize(asdu) >= 8) {
        printf("   DATA[0]: %f\n", SVSubscriber_ASDU_getFLOAT32(asdu, 0));
        printf("   DATA[1]: %f\n", SVSubscriber_ASDU_getFLOAT32(asdu, 4));
	if(msgCount==100){
	    updateSvDb(SVSubscriber_ASDU_getFLOAT32(asdu, 0),SVSubscriber_ASDU_getFLOAT32(asdu, 4));
	}
        else{
	    msgCount++;
	}
        
    }
}

int
main(int argc, char** argv)
{
    SVReceiver receiver = SVReceiver_create();

    if (argc > 1) {
        	//SVReceiver_setInterfaceId(receiver, argv[1]);
		//printf("Set interface id: %s\n", argv[1]);
		ied_num = atoi(argv[1]); 
		//printf("DB id: %d\n", ied_num);
		//Thread_sleep(10000);
    }
    //else {
        printf("Using interface DPSHMI-eth0\n");
        SVReceiver_setInterfaceId(receiver, "DPSHMI-eth0");
    //}

    /* Create a subscriber listening to SV messages with APPID 4000h */
    SVSubscriber subscriber = SVSubscriber_create(NULL, 0x4000);

    /* Install a callback handler for the subscriber */
    SVSubscriber_setListener(subscriber, svUpdateListener, NULL);

    /* Connect the subscriber to the receiver */
    SVReceiver_addSubscriber(receiver, subscriber);

    /* Start listening to SV messages - starts a new receiver background thread */
    SVReceiver_start(receiver);

    if (SVReceiver_isRunning(receiver)) {
        signal(SIGINT, sigint_handler);

        while (running)
            Thread_sleep(1000);

        /* Stop listening to SV messages */
        SVReceiver_stop(receiver);
    }
    else {
        printf("Failed to start SV subscriber. Reason can be that the Ethernet interface doesn't exist or root permission are required.\n");
    }

    /* Cleanup and free resources */
    SVReceiver_destroy(receiver);
}
