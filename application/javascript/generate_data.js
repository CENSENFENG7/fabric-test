/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('farm');

        // Submit the specified transaction.
        // let vaccination = Buffer.from(JSON.stringify({cholera: true, plague: false}));
        // const values = {
        //     age: parseInt(5),
        //     vaccination: false
        // };

        const v_status = [true, false];

        // for (let i = 4; i < 10; i ++) {
        //     // let randomAge = Math.floor(Math.random() * 7);
        //     // let randomCondition = Math.floor(Math.random() * 2);
        //     // let tx = await contract.submitTransaction('createCage', 'duck', 3, 8000, 'none' , 'Gwangju', 'SK', 'farm');
        //     console.log(`${i} ok - ${tx.toString()}`);
        // }

        //contract.submitTransaction('createCage', docType, Age, number, vaccination , place , feedBrand, owner);
        const newCageNum =3;
        for (let i=0; i < newCageNum; i++){
            let tx = await contract.submitTransaction('createCage', 'duck', 3, 8000, 'none' , 'Gwangju');
            console.log(`success to create cage - ${tx}`);
        }
        


        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
