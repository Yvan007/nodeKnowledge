import passport from 'koa-passport';
import { Strategy } from 'passport-local';
import { AdminUser } from '../modles';
import {NET} from "../config/config";
passport.serializeUser((admin, done) => {

    done(null, admin.id);
});

passport.deserializeUser(
    async(id, done) => {
        try {

            const admin = await AdminUser.findOne({ 'id': id });
            done(null, admin);
        } catch (err) {
            done(err);
        }
    });

passport.use('local', new Strategy({ usernameField: 'username', passwordField: 'password' },
    async(username, password, done) => {

        try {
            const admin = await AdminUser.findOne({ where: { 'username': username } });
            if (!admin) {
                return done(null, NET.error("该用户不存在"));
            }

            try {
                //await 等待promise 有返回结果了 在执行
                const isMatch = await admin.validatePassword(password);

                if (!isMatch) {
                    return done(null,  NET.error("密码不正确"));
                }

                done(null, NET.success(admin));
            } catch (err) {
                done(err);
            }
        } catch (err) {
            return done(err);
        }
    }
));