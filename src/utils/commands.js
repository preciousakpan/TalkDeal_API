"npx sequelize-cli model:generate --name User --attributes first_name:string";

"npx sequelize-cli db:migrate:undo --name 20180704124934-create-user.js"

"npx sequelize-cli db:migrate:undo:all"

"npx sequelize-cli db:migrate"

"npx sequelize-cli db:seed:all"



/*
npm uninstall -g babel
2023-01-14T15:08:03.402807+00:00 app[web.1]:     npm install --save-dev babel-cli
* */