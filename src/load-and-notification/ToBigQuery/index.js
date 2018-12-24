exports.ToBigQuery = (event, callback) => {
    console.log(JSON.stringify(event.data));

    const BigQuery = require('@google-cloud/bigquery');
    const Storage = require('@google-cloud/storage');

    const projectId = 'sandbox-xxxxx';
    const datasetId = 'xxxx';
    const tableId = 'xxxx';
    const bucketName = 'gs://sandbox-xxxxxx';
    const filename = 'xxxxxxxxx.csv';

    const bigquery = new BigQuery({
        projectId: projectId
    });
    const dataset = bigquery.dataset(datasetId);
    const table = dataset.table(tableId);

    const storage = Storage({
        projectId: projectId
    });

    const data = storage.bucket(bucketName).file(filename);

    asyncLoad(table, data, callback);

};

function asyncLoad(table, data, callback) {

    const projectId = 'sandbox-xxxxx';
    const topicName = 'after-load';
    const metadata = {
        allowJaggedRows: false,
        skipLeadingRows: 1
    };

    table.createLoadJob(data, metadata).then((results) => {
        const job = results[0];
        console.log(`Job ${job.id} started.`);

        const PubSub = require('@google-cloud/pubsub');
        // PubSub
        const pubsubClient = new PubSub({
            projectId: projectId
        });
        const topic = pubsubClient.topic(topicName);
        const publisher = topic.publisher();

        publisher.publish(Buffer.from(job.id));
        console.log(`publish ${job.id}`);
    });

    callback();
} 
