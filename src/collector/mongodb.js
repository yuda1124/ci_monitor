// #
// sudo docker exec 77fe14c815c3 mongo --eval 'db.serverStatus()'
// # num of db
// sudo docker exec 77fe14c815c3 mongo --eval 'db.getSiblingDB("admin").runCommand({ "listDatabases": 1 }).databases'
// # db summery
// sudo docker exec 77fe14c815c3 mongotop --json -n 1
// # db host current status
// sudo docker exec 77fe14c815c3 mongostat