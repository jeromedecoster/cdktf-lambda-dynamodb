deploy() {
    log START $(date "+%Y-%d-%m %H:%M:%S")
    START=$SECONDS

    cd $PROJECT_DIR/cdktf
    cdktf deploy --auto-approve
    
    log END $(date "+%Y-%d-%m %H:%M:%S")
    # 107 seconds (creation)
    #  66 seconds (no modification, just after creation)
    #  60 seconds (update lambda, uncomment `return buildResponse(200, event)`)
    #  46 seconds (update lambda,   comment `return buildResponse(200, event)`)
    info DURATION $(($SECONDS - $START)) seconds
}

deploy
