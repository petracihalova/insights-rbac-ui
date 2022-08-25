import * as ActionTypes from '../action-types';
import * as GroupHelper from '../../helpers/group/group-helper';
import { useIntl } from 'react-intl';
import { BAD_UUID } from '../../helpers/shared/helpers';
import messages from '../../Messages';

const handleUuidError = (err) => {
  const error = err?.errors?.[0] || {};
  if (error.status === '400' && error.source === 'group uuid validation') {
    return { error: BAD_UUID };
  }

  throw err;
};

export const fetchGroups = (options = {}) => ({
  type: ActionTypes.FETCH_GROUPS,
  payload: GroupHelper.fetchGroups(options),
});

export const fetchAdminGroup = (filterValue) => ({
  type: ActionTypes.FETCH_ADMIN_GROUP,
  payload: GroupHelper.fetchGroups({
    limit: 1,
    ...(filterValue?.length > 0 ? { filters: { name: filterValue }, nameMatch: 'partial' } : {}),
    adminDefault: true,
  }),
});

export const fetchSystemGroup = (filterValue) => ({
  type: ActionTypes.FETCH_SYSTEM_GROUP,
  payload: GroupHelper.fetchGroups({
    limit: 1,
    ...(filterValue?.length > 0 ? { filters: { name: filterValue }, nameMatch: 'partial' } : {}),
    platformDefault: true,
  }),
});

export const fetchGroup = (apiProps) => ({
  type: ActionTypes.FETCH_GROUP,
  payload: GroupHelper.fetchGroup(apiProps).catch(handleUuidError),
});

export const addGroup = (groupData) => ({
  type: ActionTypes.ADD_GROUP,
  payload: GroupHelper.addGroup(groupData).catch((err) => {
    const error = err?.errors?.[0] || {};
    if (error.status === '400' && error.source === 'name') {
      return {
        error: true,
      };
    }

    /**
     * Convert any other API error response to not crash notifications.
     * It has different format than other API requests.
     */
    throw {
      message: error.detail,
      description: error.source,
    };
  }),
});

export const updateGroup = (groupData) => {
  const intl = useIntl();
  return {
    type: ActionTypes.UPDATE_GROUP,
    payload: GroupHelper.updateGroup(groupData),
    meta: {
      notifications: {
        fulfilled: {
          variant: 'success',
          title: intl.formatMessage(messages.editGroupSuccessTitle),
          dismissDelay: 8000,
          dismissable: true,
          description: intl.formatMessage(messages.editGroupSuccessDescription),
        },
        rejected: {
          variant: 'danger',
          title: intl.formatMessage(messages.editGroupErrorTitle),
          dismissDelay: 8000,
          dismissable: true,
          description: intl.formatMessage(messages.editGroupErrorDescription),
        },
      },
    },
  };
};

export const removeGroups = (uuids) => {
  const intl = useIntl();
  return {
    type: ActionTypes.REMOVE_GROUPS,
    payload: GroupHelper.removeGroups(uuids),
    meta: {
      notifications: {
        fulfilled: {
          variant: 'success',
          dismissDelay: 8000,
          title: intl.formatMessage(uuids.length > 1 ? messages.removeGroupsSuccess : messages.removeGroupSuccess),
        },
        rejected: {
          variant: 'danger',
          dismissDelay: 8000,
          title: intl.formatMessage(uuids.length > 1 ? messages.removeGroupsError : messages.removeGroupError),
        },
      },
    },
  };
};

export const resetSelectedGroup = () => ({
  type: ActionTypes.RESET_SELECTED_GROUP,
});

export const addMembersToGroup = (groupId, members) => {
  const intl = useIntl();
  return {
    type: ActionTypes.ADD_MEMBERS_TO_GROUP,
    payload: GroupHelper.addPrincipalsToGroup(groupId, members),
    meta: {
      notifications: {
        fulfilled: {
          variant: 'success',
          title: intl.formatMessage(messages.addGroupMembersSuccessTitle),
          dismissDelay: 8000,
          description: intl.formatMessage(messages.addGroupMembersSuccessDescription),
        },
        rejected: {
          variant: 'danger',
          title: intl.formatMessage(messages.addGroupMembersErrorTitle),
          dismissDelay: 8000,
          description: intl.formatMessage(messages.addGroupMembersErrorDescription),
        },
      },
    },
  };
};

export const removeMembersFromGroup = (groupId, members) => {
  const intl = useIntl();
  return {
    type: ActionTypes.REMOVE_MEMBERS_FROM_GROUP,
    payload: GroupHelper.deletePrincipalsFromGroup(groupId, members),
    meta: {
      notifications: {
        fulfilled: {
          variant: 'success',
          title: intl.formatMessage(messages.removeGroupMembersSuccessTitle),
          dismissDelay: 8000,
          description: intl.formatMessage(messages.removeGroupMembersSuccessDescription),
        },
        rejected: {
          variant: 'danger',
          title: intl.formatMessage(messages.removeGroupMembersErrorTitle),
          dismissDelay: 8000,
          description: intl.formatMessage(messages.removeGroupMembersErrorDescription),
        },
      },
    },
  };
};

export const fetchRolesForGroup = (groupId, pagination, options) => ({
  type: ActionTypes.FETCH_ROLES_FOR_GROUP,
  payload: GroupHelper.fetchRolesForGroup(groupId, false, pagination, options).catch(handleUuidError),
});

export const fetchMembersForGroup = (groupId, usernames, options) => ({
  type: ActionTypes.FETCH_MEMBERS_FOR_GROUP,
  payload: GroupHelper.fetchPrincipalsForGroup(groupId, usernames, options).catch(handleUuidError),
});

export const fetchAddRolesForGroup = (groupId, pagination, options) => ({
  type: ActionTypes.FETCH_ADD_ROLES_FOR_GROUP,
  payload: GroupHelper.fetchRolesForGroup(groupId, true, pagination, options).catch(handleUuidError),
});

export const addRolesToGroup = (groupId, roles) => {
  const intl = useIntl();
  return {
    type: ActionTypes.ADD_ROLES_TO_GROUP,
    payload: GroupHelper.addRolesToGroup(groupId, roles),
    meta: {
      notifications: {
        fulfilled: {
          variant: 'success',
          title: intl.formatMessage(messages.addGroupRolesSuccessTitle),
          dismissDelay: 8000,
          description: intl.formatMessage(messages.addGroupRolesSuccessDescription),
        },
        rejected: {
          variant: 'danger',
          title: intl.formatMessage(messages.addGroupRolesErrorTitle),
          dismissDelay: 8000,
          description: intl.formatMessage(messages.addGroupRolesErrorDescription),
        },
      },
    },
  };
};

export const removeRolesFromGroup = (groupId, roles) => {
  const intl = useIntl();
  return {
    type: ActionTypes.REMOVE_ROLES_FROM_GROUP,
    payload: GroupHelper.deleteRolesFromGroup(groupId, roles),
    meta: {
      notifications: {
        fulfilled: {
          variant: 'success',
          title: intl.formatMessage(messages.removeGroupRolesSuccessTitle),
          dismissDelay: 8000,
          description: intl.formatMessage(messages.removeGroupRolesSuccessDescription),
        },
        rejected: {
          variant: 'danger',
          title: intl.formatMessage(messages.removeGroupRolesErrorTitle),
          dismissDelay: 8000,
          description: intl.formatMessage(messages.removeGroupRolesErrorDescription),
        },
      },
    },
  };
};

export const updateGroupsFilters = (filters) => ({
  type: ActionTypes.UPDATE_GROUPS_FILTERS,
  payload: filters,
});
