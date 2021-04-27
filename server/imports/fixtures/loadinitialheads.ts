import {
	check
} from 'meteor/check';
import {
	Accounts
} from 'meteor/accounts-base';
import {
	Csvdata,
	Productcategory,
	Subcategory,
	Head
} from '../../../both/collections/csvdata.collection';

export function loadinitialheads() {
	// this code will add income & expense head if there is not head in head collection
	if (Head.find().cursor.count() === 0) {
		const heads = [{
				head: 'Income'
			},
			{
				head: 'Expense'
			}
		];
		heads.forEach((defaulthead) => Head.insert(defaulthead));
	}
}
