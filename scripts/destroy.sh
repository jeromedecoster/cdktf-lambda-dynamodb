destroy() {
    log START $(date "+%Y-%d-%m %H:%M:%S")
    START=$SECONDS

    cd $PROJECT_DIR/cdktf
    cdktf destroy --auto-approve
    
    log END $(date "+%Y-%d-%m %H:%M:%S")
    # 50 seconds (destruction)
    # 36 seconds (no modification, just after destruction)
    info DURATION $(($SECONDS - $START)) seconds
}

destroy
