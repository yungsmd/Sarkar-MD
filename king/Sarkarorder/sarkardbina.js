import { dBinary } from '../../lib/binary.cjs';
import config from '../../config.cjs';

const dbinary = async (m, gss) => {
const prefix = config.PREFIX;
const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['dbinary'];

   if (validCommands.includes(cmd)) {
         if (!text) return m.reply('Please provide a text.');
         await m.React('⏳');
         let db = await dBinary(text)
         m.reply(db)
   }
};
await m.React('✅'); 
export default dbinary;
