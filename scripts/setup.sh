install-aws-cdktf() {
    log npm install --global cdktf-cli
    npm i --global cdktf-cli

    # https://stackoverflow.com/a/46749819/1503073
    # https://arve0.github.io/npm-download-size/#cdktf-cli
    log npm install --global download-size
    npm i --global download-size

    info compute cdktf-cli package size
    # important package size !
    # cdktf-cli@0.7.0: 34.11 MiB
    download-size cdktf-cli
}

create-cdktf-project() {
    # an empty directory is required to create a project
    mkdir --parents $PROJECT_DIR/cdktf
    cd $PROJECT_DIR/cdktf
    
    log cdktf init
    # possible values [csharp|go|java|python|python-pip|typescript]
    cdktf init --template=typescript --local --project-name $PROJECT_NAME --project-description $PROJECT_NAME

    info compute package size
    # empty project crazy size ! 
    # 113M    .
    # 114M    .
    du --summarize --human-readable

    info compute files count
    # empty project crazy files count !
    # 6805
    # 6809
    find . -type f | wc -l

    log npm install @cdktf/provider-aws
    npm install @cdktf/provider-aws

    info compute @cdktf/provider-aws package size
    # package size
    # @cdktf/provider-aws@2.0.13: 9.16 MiB
    download-size @cdktf/provider-aws

    # ignore the next lines

    # https://learn.hashicorp.com/tutorials/terraform/cdktf-build?in=terraform/cdktf#add-aws-provider
    # log add aws-provider to cdktf.json
    
    # backup original cdktf.json (option --no-clobber: do not overwrite an existing file)
    # cp --no-clobber cdktf.json cdktf.json.bak
    
    # add provider and overwrite cdktf.json
    # JSON=$(jq '.terraformProviders = ["hashicorp/aws@~> 3"]' < cdktf.json)
    
    # must be done in 2 pass (store in variable) instead of 
    # inline like : jq '.terraformProviders = ["hashicorp/aws@~> 3"]' < cdktf.json > cdktf.json
    #     or like : jq '.terraformProviders = ["hashicorp/aws@~> 3"]' < cdktf.json | tee cdktf.json
    # echo "$JSON" > cdktf.json
    
    # generate typescript constructs
    # log cdktf get to generate typescript constructs in .gen
    # cdktf get

    # info compute .gen directory size
    # 26M     .gen
    # du --summarize --human-readable .gen
}

copy-cdktf-templates() {
    [[ -f $PROJECT_DIR/cdktf/main.ts ]] && mv $PROJECT_DIR/cdktf/main.ts $PROJECT_DIR/cdktf/main.ts.bak || true
    cp --force --recursive $PROJECT_DIR/cdktf.tmpl/* $PROJECT_DIR/cdktf
}

install-aws-cdktf
create-cdktf-project
copy-cdktf-templates
