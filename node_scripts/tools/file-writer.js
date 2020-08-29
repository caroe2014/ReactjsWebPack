// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import config from 'app.config';

const logger = config.logger.child({component: path.basename(__filename)});

const FileWriter = {
    write: (filename, content) => {
        try {
            fs.writeFileSync(path.join(config.paths.root, filename), content);
        } catch (err) {
            logger.error(`Unable to write to ${filename} - err`);
            throw err;
        }
        logger.info(`Write :: ${filename}`);
    },
    remove: (filename) => {
        try {
            var filePath = path.join(config.paths.root, filename);
            rimraf.sync(filePath);
        } catch (err) {
            logger.error(`Unable to delete ${filename} - ${err})`);
            throw err;
        }
        logger.info(`Removed :: ${filename}`);
    }
};


module.exports = FileWriter;
