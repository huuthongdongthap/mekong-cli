const moduleAlias = require('module-alias');
const path = require('path');

moduleAlias.addAlias('@linkedu/api', path.join(__dirname));
moduleAlias.addAlias('@linkedu/api/modules', path.join(__dirname, 'modules'));
moduleAlias.addAlias('@linkedu/api/common', path.join(__dirname, 'common'));
moduleAlias.addAlias('@linkedu/shared', path.join(__dirname, '../shared/src'));
moduleAlias.addAlias('@linkedu/api/common/prisma', path.join(__dirname, 'common/prisma'));
moduleAlias.addAlias('@linkedu/api/common/prisma/prisma.service', path.join(__dirname, 'common/prisma/prisma.service.js'));
moduleAlias.addAlias('@linkedu/api/common/prisma/prisma.module', path.join(__dirname, 'common/prisma/prisma.module.js'));
moduleAlias.addAlias('@linkedu/api/common/mail', path.join(__dirname, 'common/mail'));
moduleAlias.addAlias('@linkedu/api/common/mail/mail.module', path.join(__dirname, 'common/mail/mail.module.js'));
moduleAlias.addAlias('@linkedu/api/common/mail/mail.service', path.join(__dirname, 'common/mail/mail.service.js'));
moduleAlias.addAlias('@linkedu/api/common/filters', path.join(__dirname, 'common/filters'));
moduleAlias.addAlias('@linkedu/api/common/filters/vi-en.exception.filter', path.join(__dirname, 'common/filters/vi-en.exception.filter.js'));
moduleAlias.addAlias('@linkedu/api/common/interceptors', path.join(__dirname, 'common/interceptors'));
moduleAlias.addAlias('@linkedu/api/common/interceptors/transform.interceptor', path.join(__dirname, 'common/interceptors/transform.interceptor.js'));

require('tsconfig-paths/register');

require('./main.js');
