import jwt from "jsonwebtoken";
import db from "../classes/Database";
import conf from "../conf/conf";
import bcrypt from "bcrypt";

class AuthService {
  constructor() {
    this.db = new db("users");
  }
  async getSingleTokenByEmail(username) {
    const users = await this.db.get({ username });
    return users.length ? users[0] : null;
  }

  jwtSignToken(token) {
    return new Promise((resolve, reject) => {
      const jwtOptions = {};

      const payload = {
        jti: token.id,
      };

      if (token.username && token.username.length > 0) {
        payload.username = token.username;
      }

      if (token.expiration) {
        jwtOptions.expiresIn = token.expiration * 60 * 60;
      }

      jwt.sign(payload, conf.jwtSecretKey, jwtOptions, (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      });
    });
  }

  async getToken(username, password) {
    if (!username || !password) {
      return null;
    }
    const token = await this.getSingleTokenByEmail(username);
    if (token && token.password) {
      if (bcrypt.compareSync(password, token.password)) {
        return this.jwtSignToken(token)
          .then((signedToken) => {
            return signedToken;
          })
          .catch((err) => {
            return null;
          });
      } else {
        return null;
      }
    }
    return null;
  }

  async login(username, password) {
    if (!username || !password) {
      return { token: null, error: "One or more parameters are missing" };
    }
    const token = await this.getToken(username, password);
    if (token) {
      return { token: token, error: null };
    }
    return { token: null, error: "Incorrect username or password" };
  }

  async register(username, password) {
    const token = await this.getSingleTokenByEmail(username);
    if (!token) {
      const hash = bcrypt.hashSync(password, conf.saltRounds);
      const insertedId = await this.db.insert({
        username: username,
        password: hash,
        date_created: new Date(),
      });
      return { success: true, id: insertedId };
    }
    return { success: false, error: "username already exists" };
  }
}

export default new AuthService();
