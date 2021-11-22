import { Construct } from 'constructs'
import { TerraformOutput } from 'cdktf'
import { APIGateway, LambdaFunction } from '@cdktf/provider-aws'

interface ApiGatewayProps {
  lambda: LambdaFunction.LambdaFunction
}

export class ApiGatewayStack extends Construct {
    
    public readonly api: APIGateway.ApiGatewayRestApi

    constructor(scope: Construct, name: string, props: ApiGatewayProps) {
        super(scope, name)

        this.api = new APIGateway.ApiGatewayRestApi(this, 'ApiGateway', {
          name: String(process.env.PROJECT_NAME),
          endpointConfiguration: {
            types: ['REGIONAL']
          }
        })

        // path: /{proxy+}
        
        const proxy = new APIGateway.ApiGatewayResource(this, `${process.env.PROJECT_NAME}-proxy`, {
          restApiId: this.api.id,
          parentId: this.api.rootResourceId,
          pathPart: '{proxy+}',
        })
    
        const proxyMethod = new APIGateway.ApiGatewayMethod(this, `${process.env.PROJECT_NAME}-proxy-method`, {
          restApiId: this.api.id,
          resourceId: proxy.id,
          authorization: 'NONE',
          httpMethod: 'ANY'
        })
        
        const proxyIntegration = new APIGateway.ApiGatewayIntegration(this, `${process.env.PROJECT_NAME}-proxy-integration`, {
          httpMethod: proxyMethod.httpMethod,
          resourceId: proxy.id,
          restApiId: this.api.id,
          type: 'AWS_PROXY',
          integrationHttpMethod: 'POST',
          uri: props.lambda.invokeArn
        })

        // path: /
    
        const root = new APIGateway.ApiGatewayMethod(this, `${process.env.PROJECT_NAME}-root-method`, {
          restApiId: this.api.id,
          resourceId: this.api.rootResourceId,
          authorization: 'NONE',
          httpMethod: 'ANY'
        })
    
        const rootIntegration = new APIGateway.ApiGatewayIntegration(this, `${process.env.PROJECT_NAME}-root-integration`, {
          restApiId: this.api.id,
          resourceId: root.resourceId,
          httpMethod: root.httpMethod,
          type: 'AWS_PROXY',
          integrationHttpMethod: 'POST',
          uri: props.lambda.invokeArn
        })  
    
        const deployment = new APIGateway.ApiGatewayDeployment(this, `${process.env.PROJECT_NAME}-deployment`, {
          restApiId: this.api.id,
          dependsOn: [
            proxyIntegration, 
            rootIntegration
          ],
          stageName: 'prod',
        })

        // Lambda Permission

        new LambdaFunction.LambdaPermission(this, `${process.env.PROJECT_NAME}-apigateway-lambda-permission`, {
          action: 'lambda:InvokeFunction',
          functionName: props.lambda.functionName,
          principal: 'apigateway.amazonaws.com',
          sourceArn: `${this.api.executionArn}/*/*`,
        })

        new TerraformOutput(this, 'url', {
          value: deployment.invokeUrl,
        })
    }
}