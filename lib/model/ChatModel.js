import { MongoClient } from 'mongodb';
import assert from 'assert';

export default class ChatModel {
    constructor() {
        const uri = "mongodb://admin:asd123@ds363038.mlab.com:63038/chat_app_lupin_153";
        this.dbName = "chat_app_lupin_153";
        this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    insertDocuments = (collectionName, data) => {
        this.client.connect((err) => {
            assert.equal(null, err);
            const db = this.client.db(this.dbName);
            const collection = db.collection(collectionName);
            //=================================
            collection.insertMany(data, (err, result) => {
                assert.equal(err, null);
                this.client.close();
            });
        });
    };

    findDocuments = (collectionName, cb) => {
        this.client.connect((err) => {
            assert.equal(null, err);
            const db = this.client.db(this.dbName);
            const collection = db.collection(collectionName);
            //=================================
            collection.find({}).toArray((err, docs) => {
                assert.equal(err, null);
                console.log("Found the following records");
                console.log(docs);
                cb(docs);
            });
        });
    };

    updateDocument = (collectionName) => {
        this.client.connect((err) => {
            assert.equal(null, err);
            const db = this.client.db(this.dbName);
            const collection = db.collection(collectionName);
            //=================================
            collection.updateOne({ a: 2 }
                , { $set: { b: 1 } }, (err, result) => {
                    assert.equal(err, null);
                    assert.equal(1, result.result.n);
                    console.log("Updated the document with the field a equal to 2");
                    this.client.close();
                });
        });
    };

    removeDocument = (collectionName) => {
        this.client.connect((err) => {
            assert.equal(null, err);
            const db = this.client.db(this.dbName);
            const collection = db.collection(collectionName);
            //=================================
            collection.deleteOne({ a: 3 }, (err, result) => {
                assert.equal(err, null);
                assert.equal(1, result.result.n);
                console.log("Removed the document with the field a equal to 3");
                this.client.close();
            });
        });
    };

    indexCollection = (collectionName) => {
        this.client.connect((err) => {
            assert.equal(null, err);
            const db = this.client.db(this.dbName);
            const collection = db.collection(collectionName);
            //=================================
            collection.createIndex(
                { "a": 1 }, null, (err, results) => {
                    console.log(results);
                    this.client.close();
                }
            );
        });
    };
}