import cheerio from 'cheerio';
import * as R from 'ramda';

const getScriptObject = (response: string, key: string) => {
    const $ = cheerio.load(response);
    const scriptRegex = />AF_initDataCallback[\s\S]*?<\/script/g;
    const keyRegex = /(ds:.*?)'/;
    const valueRegex = /data:([\s\S]*?), sideChannel: {}}\);<\//;
    
    const matches = response.match(scriptRegex);
    const script = $('script:contains("AF_initDataCallback")').last().text();
    //const json = script.match(/AF_initDataCallback\((.*)\)/);
    
    if (!matches) {
        return {};
    }
    
    const parsedData = matches.reduce((accum, data) => {
        const keyMatch = data.match(keyRegex);
        const valueMatch = data.match(valueRegex);
        
        if (keyMatch && valueMatch) {
            const key = keyMatch[1];
            const value = JSON.parse(valueMatch[1]);
            return R.assoc(key, value, accum);
        }
        
        return accum;
    }, {});
    
    return Object.assign(
        {},
        parsedData
    );
}

/**
* Map the MAPPINGS object, applying each field spec to the parsed data.
* If the mapping value is an array, use it as the path to the extract the
* field's value. If it's an object, extract the value in object.path and pass
* it to the function in object.fun
*
* @param {array} mappings The mappings object
*/
function extractor (mappings: any) {
    return function extractFields (parsedData: Record<string, any>) {
      return R.map((spec: any) => {
        if (R.is(Array, spec)) {
          return R.path(spec as any, parsedData);
        }
  
        // extractDataWithServiceRequestId explanation:
        // https://github.com/facundoolano/google-play-scraper/pull/412
        // assume spec object
        const input = R.path(spec.path, parsedData);
  
        return spec.fun(input, parsedData);
      }, mappings);
    };
  }
  

export {
    extractor,
    getScriptObject
}