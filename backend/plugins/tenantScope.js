// plugins/tenantScope.js
// Applied to every tenant-scoped schema (i.e. every schema with a workspaceId field).
// Throws a hard runtime error on any find/update/delete that doesn't explicitly
// scope by workspaceId, to prevent silent cross-college data leakage.

const SCOPED_QUERY_METHODS = [
  "find",
  "findOne",
  "findOneAndUpdate",
  "findOneAndDelete",
  "updateOne",
  "updateMany",
  "deleteOne",
  "deleteMany",
  "countDocuments",
];

export default function tenantScope(schema) {
  SCOPED_QUERY_METHODS.forEach((method) => {
    schema.pre(method, function (next) {
      const filter = this.getFilter();

      if (!Object.prototype.hasOwnProperty.call(filter, "workspaceId")) {
        throw new Error(
          `[tenantScope] Unscoped "${method}" query on "${this.model.modelName}" — ` +
            `every query must include an explicit workspaceId filter.`
        );
      }

      next();
    });
  });
}