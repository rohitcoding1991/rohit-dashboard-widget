import { api } from "@telesero/frontend-common";

export const isModuleAvailable = (advertisedPages, moduleName) => {
  const flatAdvertisedPages = advertisedPages?.flat() || [];
  if (flatAdvertisedPages.length === 0) return false;

  return flatAdvertisedPages.some(
    (page) => page.name?.trim().toLowerCase() === moduleName?.toLowerCase()
  );
};

export const getModuleById = (advertisedPages, moduleId) => {
  const flatAdvertisedPages = advertisedPages?.flat() || [];
  if (flatAdvertisedPages.length === 0) return null;

  return flatAdvertisedPages.find(
    (page) => page.icon?.trim().toLowerCase() === moduleId?.toLowerCase()
  );
};

export const getApi = (advertisedPages, moduleId) => {
  const module = getModuleById(advertisedPages, moduleId);

  if (module) {
    const url = module.url.endsWith("/") ? module.url : `${module.url}/`;
    const application = api.createApi(`${url}api`);
    return application;
  }
  return {
    get: () => {
      throw new Error(`Module ${moduleId} not found`);
    },
    post: () => {
      throw new Error(`Module ${moduleId} not found`);
    },
    put: () => {
      throw new Error(`Module ${moduleId} not found`);
    },
    patch: () => {
      throw new Error(`Module ${moduleId} not found`);
    },
    delete: () => {
      throw new Error(`Module ${moduleId} not found`);
    },
  };
};

// These are picked from the Advertised Pages api response -> name property
export const ModuleNames = {
  Backoffice: "backoffice",
  Switch: "switch",
  Crm: "crm",
  EmployeePortal: "employee-portal",
  WorkspaceConfig: "workspace",
  WorkspaceAgent: "workspace",
  Monitoring: "monitoring",
  Pbx: "pbx",
};
