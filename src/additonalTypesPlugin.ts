import { $, type DefinePlugin, definePluginConfig } from "@hey-api/openapi-ts";

type UserConfig = {
  name: "additionalTypes";
  //Should we generate union with all tags available in schema
  generateTags?: boolean;
  //Should we generate union with all operationsIds available in schema
  generateOperationIds?: boolean;
  //Name of the type that is exposing all tags
  tagsTypeName?: string;
  //Name of the type that is exposing all operationIds
  operationIdsTypeName?: string;
};

type AdditionalTypes = DefinePlugin<UserConfig>;

const handler: AdditionalTypes["Handler"] = ({ plugin }) => {
  const tags = new Set<string>();
  const operationIds = new Set<string>();

  if (!plugin.config.generateOperationIds && !plugin.config.generateTags) return;

  plugin.forEach("operation", (event) => {
    if (event.operation.tags && plugin.config.generateTags) {
      for (const tag of event.operation.tags) {
        tags.add(tag);
      }
    }

    if (plugin.config.generateOperationIds && event.operation.id) {
      operationIds.add(event.operation.id);
    }
  });

  const config = {
    meta: {
      category: "type",
      resource: "definition",
      tool: "typescript",
    },
  };

  const tagsTypeName = plugin.config.tagsTypeName ?? "AvailableTags";
  const operationsTypeName = plugin.config.operationIdsTypeName ?? "AvailableOperationIds";

  const symbolTags = plugin.symbol(tagsTypeName, config);
  const symbolOperationIds = plugin.symbol(operationsTypeName, config);

  const tagsTypeNode =
    tags.size === 0
      ? $.type("never")
      : $.type.or(
          ...Array.from(tags)
            .sort()
            .map((tag) => $.type.literal(tag)),
        );

  const operationIdsTypeNode =
    operationIds.size === 0
      ? $.type("never")
      : $.type.or(
          ...Array.from(operationIds)
            .sort()
            .map((tag) => $.type.literal(tag)),
        );

  plugin.node($.type.alias(symbolTags).export().type(tagsTypeNode));
  plugin.node($.type.alias(symbolOperationIds).export().type(operationIdsTypeNode));
};

const defaultConfig: AdditionalTypes["Config"] = {
  config: {
    generateOperationIds: true,
    generateTags: true,
  },
  dependencies: ["@hey-api/typescript"],
  handler,
  name: "additionalTypes",
};

//This plugin main purpose is to create additional types with union of all available tags/operationsIds that you may need to properly type the react-query meta invalidates
export const defineAdditionalTypesConfig = definePluginConfig(defaultConfig);
