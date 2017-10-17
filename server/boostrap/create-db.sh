
# Set up user and database
# Only tested in OSX

echo "Creating user rubylens"
createuser --superuser --createrole --inherit --login rubylens
echo "Creating databse ruby-lens"
createdb -O rubylens -Eutf8 ruby-lens
echo "Creating tables"
psql -U rubylens -h localhost ruby-lens -f ../database/schema.sql
echo "Inserting Games"
psql -U rubylens -h localhost ruby-lens -f ../database/games.sql
