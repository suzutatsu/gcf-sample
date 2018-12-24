/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload and metadata.
 * @param {!Function} callback Callback function to signal completion.
 */
exports.checkJobStatus = (event, callback) => {
    const pubsubMessage = event.data;
    console.log(pubsubMessage);
    const jobid = Buffer.from(pubsubMessage.data, 'base64').toString();
    console.log(jobid);
    const projectId = 'sandbox-xxxxx';
    const BigQuery = require('@google-cloud/bigquery');
    const bigquery = new BigQuery({
        projectId: projectId
    });

    const job = bigquery.job(jobid);

    job.on('complete', function (metadata) {
        console.log('job complete.');
        callback();
    });

    job.on('error', function (err) {
        console.log('job error.');
    });
};
