// (C) 2017 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const process = require('process');

// These are magic values controlled in the Gruntfile.js and environmentE2eMap.json
module.exports.ENVIRONMENT              = process.env.environ;
module.exports.TENANT                   = process.env.tenant;
module.exports.USERNAME                 = process.env.username;
module.exports.PASSWORD                 = process.env.password;
module.exports.bannerColor        = "#000000";
module.exports.bannerTextColor    = "#ffff33";
module.exports.titleHeaderColor         = "#505050";
module.exports.buttonControlColor       = "#c837f7";
module.exports.buttonTextColor          = "#ffffff";
module.exports.bannerColorNew     = "#fa4848";
module.exports.bannerTextColorNew = "#f8f828";
module.exports.titleHeaderColorNew      = "#464040";
module.exports.buttonControlColorNew    = "#ee1198";
module.exports.buttonTextColorNew       = "#e0dada";


module.exports.devileryDestination2Entries = "[" +
    "                {" +
    "                    \"fieldName\": \"Building - enter building letter (A, B, C, etc.) for Corporate Campus only. We do not deliver to West Campus\",\n" +
    "                    \"validationRegEx\": \"^[a-zA-Z]{1,4}$\"," +
    "                    \"characterRestriction\": \"ALPHA\",\n" +
    "                    \"characterMinLength\": 2,\n" +
    "                    \"characterMaxLength\": 4,\n" +
    "                    \"kitchenText\": \"Bld\"\n" +
    "                },\n" +
    "                {\n" +
    "                    \"fieldName\": \"Floor1\",\n" +
    "                    \"validationRegEx\": \"^[a-zA-Z0-9]{0,2}$\",\n" +
    "                    \"characterRestriction\": \"ALPHA_NUMERIC\",\n" +
    "                    \"characterMinLength\": 1,\n" +
    "                    \"characterMaxLength\": 2,\n" +
    "                    \"kitchenText\": \"FlR\"\n" +
    "                }\n" +
    "            ]";

module.exports.devileryDestination3Entries = "[\n" +
    "                {\n" +
    "                    \"fieldName\": \"Building - enter building letter (A, B, C, etc.) for Corporate Campus only. We do not deliver to West Campus\",\n" +
    "                    \"validationRegEx\": \"^[a-zA-Z]{1,4}$\",\n" +
    "                    \"characterRestriction\": \"ALPHA\",\n" +
    "                    \"characterMinLength\": 2,\n" +
    "                    \"characterMaxLength\": 4,\n" +
    "                    \"kitchenText\": \"Bld\"\n" +
    "                },\n" +
    "                {\n" +
    "                    \"fieldName\": \"Floor1\",\n" +
    "                    \"validationRegEx\": \"^[a-zA-Z0-9]{0,2}$\",\n" +
    "                    \"characterRestriction\": \"ALPHA_NUMERIC\",\n" +
    "                    \"characterMinLength\": 1,\n" +
    "                    \"characterMaxLength\": 2,\n" +
    "                    \"kitchenText\": \"FlR\"\n" +
    "                },\n" +
    "                {\n" +
    "                    \"fieldName\": \"Suite\",\n" +
    "                    \"characterRestriction\": \"NUMERIC\",\n" +
    "                    \"characterMinLength\": 1,\n" +
    "                    \"characterMaxLength\": 2,\n" +
    "                    \"kitchenText\": \"Ste\",\n" +
    "                    \"validationRegEx\": \"^[0-9]{0,2}$\"\n" +
    "                }\n" +
    "            ]";