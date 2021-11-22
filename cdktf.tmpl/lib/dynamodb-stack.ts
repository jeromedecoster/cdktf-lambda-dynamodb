import { Construct } from 'constructs'
import { DynamoDB } from '@cdktf/provider-aws'

export class DynamoDbStack extends Construct {
    
    public readonly table: DynamoDB.DynamodbTable

    constructor(scope: Construct, name: string) {
        super(scope, name)

        this.table = new DynamoDB.DynamodbTable(this, 'Table', {
      
            name: String(process.env.PROJECT_NAME),
            hashKey: 'Id',
            rangeKey: 'Date',
            attribute: [
              { name: 'Id', type: 'S' },
              { name: 'Date', type: 'N' },
            ],
            readCapacity: 1,
            writeCapacity: 1
          })
    }
}