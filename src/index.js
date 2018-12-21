exports.ToBigQuery = (event, callback) => {
    console.log(JSON.stringify(event.data));
    console.log(JSON.stringify(event.data.attributes));

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

    const storage = Storage({
        projectId: projectId
    });

    const metadata = {
        allowJaggedRows: false,
        skipLeadingRows: 0
    };

    let job;

    bigquery
        .dataset(datasetId)
        .table(tableId)
        .load(storage.bucket(bucketName).file(filename))
        .then(results => {
            job = results[0];
            console.log(`Job ${job.id} started.`);
            return job;
        })
        .then(metadata => {
            const errors = metadata.status.errors;
            if (errors && errors.length > 0) {
                throw errors;
            }
        })
        .then(() => {
            console.log(`Job ${job.id} completed.`);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });

    callback();
};