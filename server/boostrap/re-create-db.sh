echo "Droping database"
dropdb ruby-lens
echo "Droping user"
dropuser rubylens

sh ./create-db.sh

#ALTER SEQUENCE games_id_seq RESTART WITH 1;
