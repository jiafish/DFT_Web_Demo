// Storage & Mock API
class StorageService {
    constructor() {
        this.storageKey = 'dft_app_data';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify({
                userInfo: {},
                ad8Result: null,
                careJournal: {}
            }));
        }
    }

    // UserInfo
    saveUserInfo(data) {
        const allData = this.getAllData();
        allData.userInfo = { ...allData.userInfo, ...data };
        this.saveAllData(allData);
        return this.mockAPICall('saveUserInfo', data);
    }

    getUserInfo() {
        const allData = this.getAllData();
        return allData.userInfo || {};
    }

    // AD8
    saveAD8Result(result) {
        const allData = this.getAllData();
        allData.ad8Result = result;
        this.saveAllData(allData);
        return this.mockAPICall('saveAD8Result', result);
    }

    getAD8Result() {
        const allData = this.getAllData();
        return allData.ad8Result;
    }

    // CareJournal
    saveCareJournal(date, data) {
        const allData = this.getAllData();
        if (!allData.careJournal) {
            allData.careJournal = {};
        }
        allData.careJournal[date] = data;
        this.saveAllData(allData);
        return this.mockAPICall('saveCareJournal', { date, data });
    }

    getCareJournal(date) {
        const allData = this.getAllData();
        return allData.careJournal?.[date] || null;
    }

    getAllCareJournals() {
        const allData = this.getAllData();
        return allData.careJournal || {};
    }

    // Helper methods
    getAllData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : { userInfo: {}, ad8Result: null, careJournal: {} };
    }

    saveAllData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    // Mock API call
    async mockAPICall(endpoint, data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`[Mock API] ${endpoint}:`, data);
                resolve({ success: true, data });
            }, 300);
        });
    }
}

const storage = new StorageService();

