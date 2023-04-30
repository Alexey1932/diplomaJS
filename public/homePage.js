"use strict";
const logoutBtn = new LogoutButton();

logoutBtn.action = () => {
	ApiConnector.logout(response => {
		if (response.success) {
			location.reload();
		}
	});
}

ApiConnector.current(response => {
	if (response.success) {
		ProfileWidget.showProfile(response.data);
	}
});

const ratesBoard = new RatesBoard();

function getCourse() {
	ApiConnector.getStocks(response => {
		if (response.success) {
			ratesBoard.clearTable();
			ratesBoard.fillTable(response.data);
		}
	})
}

getCourse();
setInterval(() => getCourse, 60000);


const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data) => {
	ApiConnector.addMoney(data, response => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			MoneyManager.setMessage(response.success, 'Пополнение')
		}
		else {
			MoneyManager.setMessage(response.success, 'Ошибка')
		}
	})
}

moneyManager.conversionMoneyCallback = (data) => {
	ApiConnector.convertMoney(data, response => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(response.success, 'Конвертирование');
		}
		else {
			moneyManager.setMessage(response.success, 'Ошибка');
		}
	});
}

moneyManager.sendMoneyCallback = (data) => {
	ApiConnector.transferMoney(data, response => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(response.success,
				`Успешно`);
		} else {
			moneyManager.setMessage(response.success,
				`Ошибка`);
		}
	});
};


const favoritesWidget = new FavoritesWidget();

const getFavorites = () => {
	ApiConnector.getFavorites(response => {
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(response.data);
		}
	});
};

getFavorites();

favoritesWidget.addUserCallback = (data) => {
	ApiConnector.addUserToFavorites(data, response => {
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(data);
			favoritesWidget.setMessage(response.success, 'Пользователь добавлен');
		}
		else {
			favoritesWidget.setMessage(response.success, 'Произошла ошибка');
		}
	});
}

favoritesWidget.removeUserCallback = (data) => {
	ApiConnector.removeUserFromFavorites(data, (response) => {
		if (response.success) {
			getFavorites();
			favoritesWidget.setMessage(response.success,
				`Пользователь с ID ${data} был успешно удален из избранного.`);
		} else {
			favoritesWidget.setMessage(response.success,
				`Ошибка`);
		}
	});
};