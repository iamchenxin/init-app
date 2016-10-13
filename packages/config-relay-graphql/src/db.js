/* @flow
 *
*/

import { pool } from '../config/db-conf.js';
import { transaction } from 'pg-utils';
import { SQL, R } from 'tagged-literals';

type Item = {
  id: string,
  name: string,
  content: string
};

class Db {
  constructor(): void {
  }
  async tables(): Promise<void> {
    const client = await pool.connect();
    try {
      transaction(client, [
        'CREATE SCHEMA jian',
        `CREATE TABLE jian.item (
          item_id SERIAL PRIMARY KEY,
          name text NOT NULL,
          content text NOT NULL,
          CONSTRAINT name_unique UNIQUE (name)
        )`,
      ]);
      client.release();
    } catch (e) {
      client.release(e);
      console.log('rollback', e.toString());
    }
  }
  async setItem(name: string, content: string): Promise<Item|null> {
    try {
      const rt = await pool.query(
        SQL`INSERT INTO jian.item (name, content)
      values (${name}, ${content})
      ON CONFLICT (name)
      DO UPDATE SET content = Excluded.content
      returning *`);
      const item = rt.rows[0];
      return {
        id: item.name,
        name: item.name,
        content: item.content,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async delItem(name: string): Promise<boolean> {
    try {
      const rt = await pool.query(
        SQL`DELETE FROM jian.item where name=${name}`
      );
      if ( rt.rowCount === 1 ) {
        return true;
      } else if ( rt.rowCount === 0 ) {
        return false;
      } else {
        throw new Error('should be 0|1');
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async getByName(name: string): Promise<Item|null> {
    return new Promise(async function(resolve, reject): Promise<void> {
      console.log('in getByName');
      try {
        const rt = await pool.query(
          SQL`select name, content from jian.item where name=${name}`,
        );
  //      console.log(rt);
        const db_item = rt.rows[0];
        if ( db_item ) {
          resolve({
            id: db_item.name,
            name: db_item.name,
            content: db_item.content,
          });
        } else {
          resolve(null);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  async searchName(_text: string|null): Promise< SearchResult >  {
    const text = _text ? _text : '';
    console.log('in search name');
    return pool.query(
      SQL`SELECT name, content from jian.item where name like '%${R(text)}%'`
    ).then( rt => {
      const items = rt.rows;
      const results = items.map(item => ({
        id: item.name,
        name: item.name,
        content: item.content,
      }));
      return {
        id: '0',
        results,
      };
    });
  }

}

type SearchResult = {
  id: string,
  results: Array<Item>,
};

let db: Db|void = undefined;

function getDb(): Db {
  if ( db == null ) {
    db = new Db();
  }
  return db;
}

export {
  getDb,
};

export type {
  Item,
  SearchResult,
};
