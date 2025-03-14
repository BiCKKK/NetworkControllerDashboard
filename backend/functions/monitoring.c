/* Function for monitoring throughput per MAC */

#include <linux/if_ether.h>
#include <linux/ip.h>
#include <linux/icmp.h>
#include "ebpf_switch.h"

struct countentry
{
    int bytes;
    int packets;
};

struct bpf_map_def SEC("maps") monitor = {
    .type = BPF_MAP_TYPE_HASH,
    .key_size = 6, // MAC address is the key
    .value_size = sizeof(struct countentry),
    .max_entries = 256,
};

uint64_t prog(struct packet *pkt)
{
    struct countentry *item;    

    if (bpf_map_lookup_elem(&monitor, pkt->eth.h_source, &item) == -1)
    {
        struct countentry newitem = {
            .bytes = 0,
            .packets = 0,
        };

        bpf_map_update_elem(&monitor, pkt->eth.h_source, &newitem, 0);
        item = &newitem;
    }  

    item->packets++;
    item->bytes += pkt->metadata.length;
       
    bpf_notify(0, pkt->eth.h_source, sizeof(pkt->eth.h_source));
   
    return NEXT;
}
char _license[] SEC("license") = "GPL";
