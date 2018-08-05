import Env from './env';
let config = {
    env: Env
};

if(Env=='dev'){
    config.mall_domain='http://mall.test.neigou.com'
    config.life_domain='http://life.test.neigou.com'
    config.store_domain='http://test.neigou.com'
    config.diandi_img_domain='//club.test.neigou.com/'

    config.store_api_domain='/store-api-domain'
    config.mall_api_domain='/mall-api-domain'
    config.club_api_domain='/club-api-domain'
    config.life_api_domain='/life-api-domain'




}else if(Env=='test'){
    config.mall_domain='http://mall.test.neigou.com'
    config.life_domain='http://life.test.neigou.com'
    config.club_domain='http://club.test.neigou.com'
    config.store_domain='http://test.neigou.com'

    config.diandi_img_domain='//club.test.neigou.com/'


    config.store_api_domain='//test.neigou.com'
    config.mall_api_domain='//mall.test.neigou.com'
    config.club_api_domain='//club.test.neigou.com'
    config.life_api_domain='//life.test.neigou.com'

}else if(Env=='production'){
    config.mall_domain='//mall.neigou.com'
    config.life_domain='//life.neigou.com'
    config.store_domain='//www.neigou.com'
    config.diandi_img_domain='//b.ddguanhuai.com'

    config.store_api_domain='//www.neigou.com'
    config.mall_api_domain='//mall.neigou.com'
    config.club_api_domain='//club.neigou.com'
    config.life_api_domain='//life.neigou.com'
}

if(Env=='test'||Env=='production'){
    config.neigouFallbackPath='/m/v2/'

    
}else if(Env=='dev'){
    config.neigouFallbackPath='/neigou/'
}
export default config;
