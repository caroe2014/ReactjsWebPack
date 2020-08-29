// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import path from 'path';
import FileWriter from 'node_scripts/tools/file-writer';
import config from 'app.config';

FileWriter.remove('.env');
FileWriter.remove('.eslintignore');
FileWriter.remove('.eslintrc');
if(process.env.NODE_ENV === 'development'){
  FileWriter.remove(path.relative(config.paths.root, path.join(config.paths.coverage, '*')));
  FileWriter.remove(path.relative(config.paths.root, path.join(config.paths.logs, '*')));
  FileWriter.remove(path.relative(config.paths.root, path.join(config.paths.build, '*')));
  FileWriter.remove(path.relative(config.paths.root, 'webpack-assets.json'));
}
