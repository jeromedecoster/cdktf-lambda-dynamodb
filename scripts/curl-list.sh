curl-list() {
    APIGATEWAY_ID=$(aws apigateway get-rest-apis \
        --query "items[?name=='$PROJECT_NAME'].id" \
        --region $AWS_REGION \
        --output text)
    APIGATEWAY_URL=https://$APIGATEWAY_ID.execute-api.$AWS_REGION.amazonaws.com/prod/list
    log APIGATEWAY_URL $APIGATEWAY_URL

    curl --silent $APIGATEWAY_URL | jq
}

curl-list
