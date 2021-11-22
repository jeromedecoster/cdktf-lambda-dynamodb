stats() {
    cd $PROJECT_DIR/cdktf

    CDKTF_DIR_SIZE=$(du --summarize --human-readable | cut --fields 1)
    log CDKTF_DIR_SIZE $CDKTF_DIR_SIZE

    CDKTF_FILES_COUNT=$(find . -type f | wc -l)
    log CDKTF_FILES_COUNT $CDKTF_FILES_COUNT
}

stats
