/*
 * Generated by asn1c-0.9.21 (http://lionet.info/asn1c)
 * From ASN.1 module "MMS"
 * 	found in "../mms-extended.asn"
 * 	`asn1c -fskeletons-copy`
 */

#ifndef	_ConfirmedServiceResponse_H_
#define	_ConfirmedServiceResponse_H_


#include <asn_application.h>

/* Including external dependencies */
#include "GetNameListResponse.h"
#include "ReadResponse.h"
#include "WriteResponse.h"
#include "GetVariableAccessAttributesResponse.h"
#include "DefineNamedVariableListResponse.h"
#include "GetNamedVariableListAttributesResponse.h"
#include "DeleteNamedVariableListResponse.h"
#include <constr_CHOICE.h>

#ifdef __cplusplus
extern "C" {
#endif

/* Dependencies */
typedef enum ConfirmedServiceResponse_PR {
	ConfirmedServiceResponse_PR_NOTHING,	/* No components present */
	ConfirmedServiceResponse_PR_getNameList,
	ConfirmedServiceResponse_PR_read,
	ConfirmedServiceResponse_PR_write,
	ConfirmedServiceResponse_PR_getVariableAccessAttributes,
	ConfirmedServiceResponse_PR_defineNamedVariableList,
	ConfirmedServiceResponse_PR_getNamedVariableListAttributes,
	ConfirmedServiceResponse_PR_deleteNamedVariableList
} ConfirmedServiceResponse_PR;

/* ConfirmedServiceResponse */
typedef struct ConfirmedServiceResponse {
	ConfirmedServiceResponse_PR present;
	union ConfirmedServiceResponse_u {
		GetNameListResponse_t	 getNameList;
		ReadResponse_t	 read;
		WriteResponse_t	 write;
		GetVariableAccessAttributesResponse_t	 getVariableAccessAttributes;
		DefineNamedVariableListResponse_t	 defineNamedVariableList;
		GetNamedVariableListAttributesResponse_t	 getNamedVariableListAttributes;
		DeleteNamedVariableListResponse_t	 deleteNamedVariableList;
	} choice;
	
	/* Context for parsing across buffer boundaries */
	asn_struct_ctx_t _asn_ctx;
} ConfirmedServiceResponse_t;

/* Implementation */
LIB61850_INTERNAL extern asn_TYPE_descriptor_t asn_DEF_ConfirmedServiceResponse;

#ifdef __cplusplus
}
#endif

#endif	/* _ConfirmedServiceResponse_H_ */
