/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Farm extends Contract {
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const cages = [
            {
                docType: 'duck',
                age: 1,
                number: 8000,
                vaccination: ['AI'],
                place:'Gwangju',
                feedBrand:'SK',
                owner:'test'
            },
            {
                docType: 'duck',
                age: 5,
                number: 10000,
                vaccination: ['AA'],
                place:'Gwangju',
                feedBrand:'SK',
                owner:'farm'
            },
            {
                docType: 'duck',
                age: 13,
                number: 15000,
                vaccination: ['AC'],
                place:'Gwangju',
                feedBrand:'SK',
                owner:'farm'
            },
        ];
        for (let i = 0; i < cages.length; i++) {
            await ctx.stub.putState('Cage' + i, Buffer.from(JSON.stringify(cages[i])));
            console.info('Added <--> ', cages[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    // // generate_data.js
    // async createCage(ctx,duckType,age,number,vaccination,place,feedbrand,owner) {
    //     console.info('============= START : Create cage ===========');
    //     // ==== Check if marble already exists ====
    //     // let cageState = await ctx.stub.getState(cageId);
    //     // if (cageState.toString()) {
    //     //     throw new Error("This cage already exists: " + cageId);
    //     // }
    //     let a = 0;
    //     while(typeof a =='number'){
    //         const cageAsBytes = await ctx.stub.getState('Cage'+a);
    //         if (!cageAsBytes || cageAsBytes.length === 0) {
    //             console.log('a:'+a);
    //             break;
    //         }else{
    //             a++;
    //         }
    //     } 
    //     // let cageId = 'Cage'+a;

    //     let int_age = parseInt(age);
    //     if (typeof int_age !== 'number') {
    //         throw new Error('Stage argument must be a numeric string');
    //     }

    //     let date = new Date();
    //     let dDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
    //     // eslint-disable-next-line eqeqeq
    //     let condition = [];
    //     if (vaccination !== 'none'){
    //         condition.push(vaccination);
    //     }

    //     const cage = {
    //         docType: duckType,
    //         age: int_age,
    //         number:number,
    //         vaccination: condition,
    //         place: place,
    //         feedBrand:feedbrand,
    //         owner:owner
    //     };

    //     await ctx.stub.putState('Cage'+a, Buffer.from(JSON.stringify(cage)));
    //     console.info('============= END : Create cage ===========');
    //     return ctx.stub.getTxID();
    // }

// generate_data.js
    async createCage(ctx,duckType,newCageNum,age,number,vaccination,place,feedbrand,owner) {
        console.info('============= START : Create cage ===========');
        // ==== Check if marble already exists ====
        // let cageState = await ctx.stub.getState(cageId);
        // if (cageState.toString()) {
        //     throw new Error("This cage already exists: " + cageId);
        // }
        
        let a = 0;
        while(typeof a =='number'){
            const cageAsBytes = await ctx.stub.getState('Cage'+a);
            if (!cageAsBytes || cageAsBytes.length === 0) {
                console.log('a:'+a);
                break;
            }else{
                a++;
            }
        } 
        // let cageId = 'Cage'+a;

        let int_age = parseInt(age);
        if (typeof int_age !== 'number') {
            throw new Error('Stage argument must be a numeric string');
        }

        // let date = new Date();
        // let dDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
        // eslint-disable-next-line eqeqeq
        let condition = [];
        if (vaccination !== 'none'){
            condition.push(vaccination);
        }

        const cage = {
            docType: duckType,
            age: int_age,
            number:number,
            vaccination: condition,
            place: place,
            feedBrand:feedbrand,
            owner:owner
        };

        for(let i=1;i <= newCageNum; i++){
            await ctx.stub.putState('Cage'+a, Buffer.from(JSON.stringify(cage)));
            a++;
        }
        
        console.info('============= END : Create cage ===========');
        return ctx.stub.getTxID();
    }

// // grow.js all cages' age+1
//     async changeCageAge(ctx, cageId) {
//         console.info('============= START : changeCageAge ===========');

//         const cageAsBytes = await ctx.stub.getState(cageId); // get the cage from chaincode state
//         if (!cageAsBytes || cageAsBytes.length === 0) {
//             throw new Error(`${cageId} does not exist`);
//         }

//         const cage = JSON.parse(cageAsBytes.toString());        
//         cage.age = cage.age + 1;

//         await ctx.stub.putState(cageId, Buffer.from(JSON.stringify(cage)));
//         console.info('============= END : changeCageAge ===========');
//         return ctx.stub.getTxID();
//     }

    // grow.js all cages which owner is farm age+1
    async changeCageAge(ctx) {
        console.info('============= START : changeCageAge ===========');
        let queryString = {
            selector: {
                owner: 'farm'
            }
        };
        let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        let results = JSON.parse(queryResults.toString());

        for (let i=0; i<results.length; i++){
            let cageId = results[i]['Key'];
            let cageAsBytes = await ctx.stub.getState(cageId); // get the cage from chaincode state
            if (!cageAsBytes || cageAsBytes.length === 0) {
                throw new Error(`${cageId} does not exist`);
            }
            let cage = JSON.parse(cageAsBytes.toString());        
            cage.age = cage.age + 1;
            await ctx.stub.putState(cageId, Buffer.from(JSON.stringify(cage)));
        }
        console.info('============= END : changeCageAge ===========');
        return ctx.stub.getTxID();
        // return results
    }

// delete.js if disease appear, excute this method
    async deleteCage(ctx, cageId) {
        console.info('============= START : deleteCage ===========');

        const cageAsBytes = await ctx.stub.getState(cageId); // get the cage from chaincode state
        if (!cageAsBytes || cageAsBytes.length === 0) {
            throw new Error(`${cageId} does not exist`);
        }
    
        await ctx.stub.deleteState(cageId);
        console.info('============= END : deleteCage ===========');
        return 'Deleted';
    }

// // injection.js 
//     async changeCondition(ctx, cageId, newCondition) {
//         console.info('============= START : changeCondition ===========');

//         const cageAsBytes = await ctx.stub.getState(cageId); // get the cage from chaincode state
//         if (!cageAsBytes || cageAsBytes.length === 0) {
//             throw new Error(`${cageAsBytes} does not exist`);
//         }
//         const cage = JSON.parse(cageAsBytes.toString());
//         //let condition = (String(newCondition) === 'true') ? true : false;
//         //cage.vaccination = condition;

//         // let date = new Date();
//         // let dDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
//         // cage.vaccination[newCondition] = dDate;
//         cage.vaccination.push(newCondition);

//         await ctx.stub.putState(cageId, Buffer.from(JSON.stringify(cage)));
//         console.info('============= END : changeCondition ===========');
//         return ctx.stub.getTxID();
//     }

    async changeCondition(ctx, age, newCondition) {
        console.info('============= START : changeCondition ===========');
        let queryString = {
            selector: {
                age: parseInt(age)
            }
        };
        // let queryString = {};
        // queryString.selector = {};
        // queryString.selector.age = parseInt(age);
        let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));

        // let queryResults = await this.queryWithAge(ctx,age);
        let results = JSON.parse(queryResults.toString());

        for (let i=0; i<results.length; i++){
            let cageId = results[i]['Key'];
            let cageAsBytes = await ctx.stub.getState(cageId);
            if (!cageAsBytes || cageAsBytes.length === 0) {
                throw new Error(`${cageAsBytes} does not exist`);
            }
            let cage = JSON.parse(cageAsBytes.toString());
            // cage.vaccination = await JSON.parse(cage.vaccination.toString());
            cage.vaccination.push(newCondition);
            await ctx.stub.putState(cageId, Buffer.from(JSON.stringify(cage)));
        }

        console.info('============= END : changeCondition ===========');
        return ctx.stub.getTxID();
    }

// query.js
    async queryAllCages(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await(const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                
                record = await JSON.parse(strValue);
                record.vaccination = await JSON.parse(record.vaccination);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            console.info(record);
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

// query.js
    async queryCage(ctx, cageId) {
        const cageAsBytes = await ctx.stub.getState(cageId); // get the cage from chaincode state
        if (!cageAsBytes || cageAsBytes.length === 0) {
            throw new Error(`${cageId} does not exist`);
        }
        console.log(cageAsBytes.toString());
        return cageAsBytes.toString();
    }

// query_age.js
    async queryWithAge(ctx, age) {

        let int_age = parseInt(age);
		if (typeof int_age !== "number") {
			throw new Error("Age argument must be a numeric string");
        }
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue_str = Buffer.from(value).toString('utf8');
            const strValue = JSON.parse(strValue_str.toString());
            let record;
            try {
                if(strValue.age == age){
                    record = strValue;
                }else{
                    continue;
                }
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
        
        // let queryString = {};
        // queryString.selector = {};
        // queryString.selector.age = int_age;
        // let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        // return queryResults;

        // let int_age = parseInt(age);
		// if (typeof int_age !== "number") {
		// 	throw new Error("Age argument must be a numeric string");
        // }
        
        // let queryString = {};
        // queryString.selector = {};
        // queryString.selector.age = int_age;
        // let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        // return queryResults;

    }

// ===============================================================
    async queryAll(ctx) {
    let queryString = {
        selector: {
            docType: 'duck'
        }
    };
    let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
    return queryResults;
    }

    async queryWithQueryString(ctx, queryString) {
        // let queryString = JSON.stringify(queryString);
        console.log('queryWithQueryString: start');
        // console.log(JSON.parse(queryString));

        let resultsIterator = await ctx.stub.getQueryResult(queryString);
        let allResults = [];

        // eslint-disable-next-line no-constant-condition
        while (true) {
            let res = await resultsIterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};

                console.log(res.value.value.toString('utf8'));

                jsonRes.Key = res.value.key;

                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }

                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await resultsIterator.close();
                console.info(allResults);
                console.log(JSON.stringify(allResults));
                return JSON.stringify(allResults);
            }
        }

    }

    //getHi.js
    async getFullHistory(ctx, key) {
        try{
            const promiseOfIterator = ctx.stub.getHistoryForKey(key);
            const results = [];
            for await (const keyMod of promiseOfIterator) {
                // const tx = keyMod.getTxId();
                const resp = {
                    timestamp: keyMod.timestamp
                }
                if (keyMod.is_delete) {
                    resp.data = 'KEY DELETED';
                } else {
                    resp.data = JSON.parse(keyMod.value.toString('utf8'));
                }
                resp.tx_id = keyMod.txId;
                results.push(resp);
            }
            console.log(results);
            return JSON.stringify(results);
        } catch(err){
            console.log(err);
            return JSON.stringify('this cage may not exist or has been deleted');
        }
            
    }

    async queryWithPagination(ctx, queryString, page_size, bookmark) {
        // convert to integer
        const pageSize = parseInt(page_size);
        const promiseOfIterator = ctx.stub.getQueryResultWithPagination(queryString, pageSize, bookmark);
        const results = await this.getAllResults(promiseOfIterator);
        // exract meta data informations
        const metadata = (await promiseOfIterator).metadata;
        const alldata = {data: results, meta_data: metadata};
        return JSON.stringify(alldata);
    }

    // get data from iterator
    async getAllResults(promiseOfIterator) {
        const allResults = [];
        for await (const res of promiseOfIterator) {
            // no more res.value.value ...
            // if not a getHistoryForKey iterator then key is contained in res.key
            const resp = {
                key: res.key.toString('utf8'),
            }
            if (res.is_delete) {
                resp.data = 'KEY DELETED';
            } else {
                resp.data = JSON.parse(res.value.toString('utf8'));
            }
            allResults.push(resp);
        }
    
        // iterator will be automatically closed on exit from the loop
        // either by reaching the end, or a break or throw terminated the loop
        return allResults;
    }


    async QueryAssetsWithPagination(ctx, queryString, pageSize, bookmark) {

		const {iterator, metadata} = await ctx.stub.getQueryResultWithPagination(queryString, pageSize, bookmark);
		const results = await this.GetAllResults(iterator, false);

		results.ResponseMetadata = {
			RecordsCount: metadata.fetched_records_count,
			Bookmark: metadata.bookmark,
		};

		return JSON.stringify(results);
	}
    async GetAllResults(iterator, isHistory) {
		let allResults = [];
		let res = await iterator.next();
		while (!res.done) {
			if (res.value && res.value.value.toString()) {
				let jsonRes = {};
				console.log(res.value.value.toString('utf8'));
				if (isHistory && isHistory === true) {
					jsonRes.TxId = res.value.tx_id;
					jsonRes.Timestamp = res.value.timestamp;
					try {
						jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Value = res.value.value.toString('utf8');
					}
				} else {
					jsonRes.Key = res.value.key;
					try {
						jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Record = res.value.value.toString('utf8');
					}
				}
				allResults.push(jsonRes);
			}
			res = await iterator.next();
		}
		iterator.close();
		return allResults;
	}

}

module.exports = Farm;
