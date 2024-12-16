# S3 setup

## Data bucket

Create data buckets, you can get the names from the "s3-readwrite-data-policy" file generated during [IAM Policies setup](./iam-setup.md#policies).
Notice that there are two S3 data buckets, one labeled as `main` and one as `next`; there is no bucket for `local` deploy stage.

For to _AWS Console > S3_ and make sure the wanted region is correct: it is given by the `AWS_DATA_REGION` variable. Click on _Create Bucket_, all defaults should be good. In particular the bucket **must not be public** (_ACLs disabled_ and _Block all public access_ should be flagged).
