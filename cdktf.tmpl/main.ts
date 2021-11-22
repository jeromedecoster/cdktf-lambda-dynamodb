import { Construct } from 'constructs'
import { App, TerraformStack } from 'cdktf'
import * as aws from '@cdktf/provider-aws'

import { DynamoDbStack } from './lib/dynamodb-stack'
import { LambdaStack } from './lib/lambda-stack'
import { ApiGatewayStack } from './lib/apigateway-stack'

const AWS_REGION = process.env.AWS_REGION
const TABLE_NAME = process.env.PROJECT_NAME

console.log('AWS_REGION', AWS_REGION)
console.log('TABLE_NAME', TABLE_NAME)

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    // define resources here
    new aws.AwsProvider(this, 'aws', { region: String(process.env.AWS_REGION) })

    const { table } = new DynamoDbStack(this, 'DynamoDB')
    table

    const { lambda } = new LambdaStack(this, 'Lambda', { table })
    lambda

    const { api } = new ApiGatewayStack(this, 'ApiGateway', { lambda })
    api
  }
}

const app = new App()
new MyStack(app, 'cdktf')
app.synth()
