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
setInterval(getCourse, 60000);


const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data) => {
	ApiConnector.addMoney(data, response => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(response.success, `Ваш счет был пополнен на ${data.amount} ${data.currency}.`)
		}
		else {
			moneyManager.setMessage(response.success, `Произошла ошибка: "${response.error}"`)
		}
	})
}

moneyManager.conversionMoneyCallback = (data) => {
	ApiConnector.convertMoney(data, response => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(response.success, `Конвертация из ${data.fromCurrency} в ${data.targetCurrency} прошла без ошибок.`);
		}
		else {
			moneyManager.setMessage(response.success, `В процессе конвертации из ${data.fromCurrency} в ${data.targetCurrency} произошла ошибка: "${response.error}."`);
		}
	});
}

moneyManager.sendMoneyCallback = (data) => {
	ApiConnector.transferMoney(data, response => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(response.success,
				`Средства переведены успешно.`);
		} else {
			moneyManager.setMessage(response.success,
				`При переводе средств произошла ошибка: "${response.error}."`);
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
			favoritesWidget.setMessage(response.success, `Пользователь ${data.name} с ID ${data.id} успешно добавлен в избранное.`);
		}
		else {
			favoritesWidget.setMessage(response.success, `Попытка добавить пользователя в избранное завершилась ошибкой: ${response.error}.`);
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
				`Попытка удалить пользователя из избранного завершилась ошибкой: ${response.error}.`);
		}
	});
};