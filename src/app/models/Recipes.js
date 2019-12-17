const db = require('../../app/config/db');

module.exports = {
  listAll(callback) {
    db.query(`
    SELECT recipes.*, chefs.name AS chefs_name
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    `,
      (err, results) => {
        if (err) throw `Database error: ${err}`;

        callback(results.rows);
      }
    );
  },
  create(values, callback) {
    const query = `
    INSERT INTO recipes (
      chef_id,
      image,
      title,
      ingredients,
      preparation,
      information,
      created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
    `;

    db.query(query, values, (err, results) => {
      if (err) throw `Database error: ${err}`;

      callback(results.rows[0]);
    });
  },
  findRecipe(id, callback) {
    db.query(
      `
    SELECT recipes.*, chefs.name AS chefs_name
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    WHERE recipes.id=$1
    `,
      [id],
      (err, results) => {
        if (err) throw `Database error: ${err}`;

        callback(results.rows[0]);
      }
    );
  },
  update(values, callback) {
    const query = `
    UPDATE recipes SET
      image=($1),
      title=($2),
      ingredients=($3),
      preparation=($4),
      information=($5)
    WHERE id = $6
    `;

    db.query(query, values, (err, results) => {
      if (err) throw `Database error:${err}`;

      callback();
    });
  },
  delete(id, callback) {
    const query = `
    DELETE FROM recipes
    WHERE id = $1
    `;

    db.query(query, [id], (err, results) => {
      if (err) throw `Database error:${err}`;

      callback();
    });
  },
  findBy(filter, callback) {
    db.query(`
    SELECT recipes.*, chefs.name AS chefs_name
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    WHERE recipes.title ILIKE '%${filter}%'
    OR recipes.ingredients ILIKE '%${filter}%'
   `, (err, results) => {
      if (err) throw `Database error: ${err}`


      callback(results.rows)
    });
  }
};