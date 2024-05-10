import { Validator } from "jsonschema";

const validator = new Validator();
const schema = {
  type: "object",
  properties: {
    name: { type: "string", required: true },
    link: { type: "string", required: true },
    donateLink: { type: "string", required: true },
    platform: { type: "string", enum: ["YouTube", "Twitch"], required: true },
  },
};

function validate(object) {
  return validator.validate(object, schema).errors.length === 0;
}

export default validate;
