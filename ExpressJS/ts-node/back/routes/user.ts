import * as express from 'express';
import * as bcrypt from 'bcrypt';
import { isLoggedIn, isNotLoggedIn } from './middleware';
import User from '../models/user';
import passport = require('passport');
import Post from '../models/post';

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
    res.payload;
    const user = req.user!.toJSON() as User;
    delete user.password;
    return res.json(user);
});

router.post('/', async(req, res, next) => {
    try {
        const exUser = await User.findOne({
            where: {
                userId: req.body.userId,
            },
        });
        if (exUser) {
            return res.status(403).send('이미 사용중인 아이디입니다.');
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = await User.create({
            nickname: req.body.nickname,
            userId: req.body.nickname,
            password: hashedPassword,
        });
        return res.status(200).json(newUser);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (err:Error, user:User, info: { message: string }) => {
        if(err) {
            console.error(err);
            return next(err);
        }
        if (info) {
            return res.status(401).send(info.message);
        }
        return req.login(user, async (loginErr: Error) => {
            try {
                if (loginErr){
                    return next(loginErr);
                }
                const fullUser = await User.findOne({
                    where: { id: user.id },
                    include: [{
                        model: Post,
                        as: 'Post',
                        attributes: ['id'],
                    }, {
                        model: User,
                        as: 'Followings',
                        attributes: ['id'],
                    }, {
                        model: User,
                        as: 'Followers',
                        attributes: ['id'],
                    }],
                    attributes: ['id', 'nickname', 'userId'],
                });
                return res.json(fullUser);
            } catch (e) {
                console.error(e);
                return next(e);
            }
        })
    })(req, res, next);
});

router.post('/logout', (req, res) => {
    req.logout();
    req.session!.destroy(() => {
        res.send('로그아웃 성공!');
    });
})

interface IUser extends User {
    PostCout: number;
    FollowingCount: number;
    FollowerCount: number;
}
router.get('/:id', async(req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: parseInt(req.params.id, 10) },
            include: [{
                model: Post,
                as: 'Post',
                attributes: ['id'],
            }, {
                model: User,
                as: 'Followings',
                attributes: ['id'],
            }, {
                model: User,
                as: 'Followers',
                attributes: ['id'],
            }],
            attributes: ['id'],
        });
        if (!user) {
            return res.status(404).send('존재하지 않는 유저입니다.');
        }
        const jsonUser = user.toJSON() as IUser;
        jsonUser.PostCout = jsonUser.Posts!.length;
        jsonUser.FollowingCount = jsonUser.Followings!.length;
        jsonUser.FollowerCount = jsonUser.Followers!.length;
    } catch (error) {
        console.error(error);
        return next(error);
    }
})

router.get('/:id/followings', isLoggedIn, async(req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0 },
        });
        if (!user) return res.status(404).send('존재하지 않는 유저입니다.');
        const follower = await user.getFollowings({
            attributes: ['id', 'nickname'],
        })
    } catch (error) {
        console.log(error);
        return next(error)
    }
})