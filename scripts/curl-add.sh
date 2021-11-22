curl-add() {
    APIGATEWAY_ID=$(aws apigateway get-rest-apis \
        --query "items[?name=='$PROJECT_NAME'].id" \
        --region $AWS_REGION \
        --output text)

    APIGATEWAY_URL=https://$APIGATEWAY_ID.execute-api.$AWS_REGION.amazonaws.com/prod/
    log APIGATEWAY_URL $APIGATEWAY_URL

    # random sha like c74e84eb1cc4
    # head -n 1 /dev/urandom | md5sum | head -c 12

    # random integer like 0573145346 (can start my one or more 0)
    # head /dev/urandom | tr -dc '0-9' | head -c 10

    VALUE=$(echo $RANDOM | md5sum | head -c 10)
    log VALUE $VALUE
    
    curl "${APIGATEWAY_URL}add" \
        --header "Content-Type: application/json" \
        --data '{"value":"'${VALUE}'"}' \
        --silent \
        | jq
}

curl-add
