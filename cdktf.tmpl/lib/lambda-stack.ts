import { Construct } from 'constructs'
import { AssetType, TerraformAsset } from 'cdktf'
import { DynamoDB, IAM, LambdaFunction } from '@cdktf/provider-aws'

interface LambdaStackProps {
  table: DynamoDB.DynamodbTable
}

export class LambdaStack extends Construct {
    
    public readonly lambda: LambdaFunction.LambdaFunction

    constructor(scope: Construct, name: string, props: LambdaStackProps) {
        super(scope, name)

        var lambdaRolePolicy = {
          'Version': '2012-10-17',
          'Statement': [
            {
              'Action': 'sts:AssumeRole',
              'Principal': {
                'Service': 'lambda.amazonaws.com'
              },
              'Effect': 'Allow',
              'Sid': ''
            }
          ]
        }
    
        const roleConfig: IAM.IamRoleConfig = {
          name: `${process.env.PROJECT_NAME}-lambda-role-policy`,
          assumeRolePolicy: JSON.stringify(lambdaRolePolicy),
          inlinePolicy: [{
            name: 'allow-dynamodb',
            policy: JSON.stringify({
                'Version': '2012-10-17',
                'Statement': [
                    {
                        'Action': [
                            'dynamodb:Scan',
                            'dynamodb:Query',
                            'dynamodb:BatchGetItem',
                            'dynamodb:GetItem',
                            'dynamodb:PutItem',
                        ],
                        'Resource': props.table.arn,
                        'Effect': 'Allow'
                    }
                ]
            }),
          }]
        }
    
        const role = new IAM.IamRole(this, `${process.env.PROJECT_NAME}-lambda-role`, roleConfig)
        
        new IAM.IamRolePolicyAttachment(this, `${process.env.PROJECT_NAME}-lambda-attachment`, {
          policyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
          role: String(role.name),
        })
    
        var asset = new TerraformAsset(this, `${process.env.PROJECT_NAME}-lambda-asset`, {
          path: `${__dirname}/../../lambda`,
          type: AssetType.ARCHIVE
        })
    
        const lambdaConfig: LambdaFunction.LambdaFunctionConfig = {
          functionName: String(process.env.PROJECT_NAME),
          role: role.arn.toString(),
          memorySize: 128,
          timeout: 15,
          sourceCodeHash: asset.assetHash,
          filename: asset.path,
          runtime: 'nodejs14.x', 
          handler: 'index.handler',
        }

        this.lambda = new LambdaFunction.LambdaFunction(this, `${process.env.PROJECT_NAME}-lambda`, lambdaConfig)
        
        // need to be called AFTER lambda creation
        this.lambda.putEnvironment({variables: {
          TABLE_NAME: String(process.env.PROJECT_NAME)
        }})
    }
}