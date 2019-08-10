import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Console } from '@angular/core/src/console';
@Injectable()
export class CommonService {
    constructor() { }
    finalGenerateReport(csvFullData, headarraylist, accountlistdata) {
        let totalHeadsReport = {};
        _.forEach(headarraylist, (value, key) => {
            totalHeadsReport[value['head']] = 0
        })
        _.forEach(csvFullData, (csv, key) => {
            const head = _.find(headarraylist, { '_id': csv['Assigned_head_id'] });
            if(head){
            totalHeadsReport[head['head']] += csv['Transaction_Amount(INR)']
            }
            const account = _.find(accountlistdata, { '_id': csv['AssignedAccountNo'] })
            if(!totalHeadsReport['Opening Balance (A/C: '+account['Account_no']+')']) {
                totalHeadsReport['Opening Balance (A/C: '+account['Account_no']+')'] = csv['Available_Balance(INR)'] + csv['Transaction_Amount(INR)']
            } else {
                totalHeadsReport['Closing Balance (A/C: '+account['Account_no']+ ')'] = csv['Available_Balance(INR)']
            }
            
        })
        if (totalHeadsReport['Income'] && totalHeadsReport['Transfer']) {
            totalHeadsReport['Income-Transfer'] = totalHeadsReport['Income'] - totalHeadsReport['Transfer']
        }
        const finalData = [];
        _.forEach(totalHeadsReport, (value, key) => {
            finalData.push({
                'name': key,
                'value': value
            })
        })
        return finalData;
    }
}
