import { TypePolicies } from '@apollo/client/cache';
import { relayStylePagination } from '@apollo/client/utilities';

export const DgidbTypePolicies: TypePolicies = {
  Query: {
    fields: {
      source: relayStylePagination([
        'id',
        'sourceDbName',
        'sourceDbVersion',
      ]),
    },
  },
};
