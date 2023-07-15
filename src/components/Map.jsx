import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconUrl from './marker.png';

const Map = () => {
  // Состояние переменных
  const [markers, setMarkers] = useState([
    // Исходные маркеры
    {
      name: 'ТЦ Горизонт',
      coordinates: [47.259301, 39.719791],
    },
    {
      name: 'ИВТиПТ',
      coordinates: [47.218953, 39.627433],
    },
    {
      name: 'Библиотека',
      coordinates: [47.228379, 39.726662],
    },
    {
      name: 'Правительство Ростовской области',
      coordinates: [47.220835, 39.720871],
    },
    {
      name: 'Собор Пресвятой Богородицы',
      coordinates: [47.217253, 39.712026],
    },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Загрузка маркеров из localStorage или использование исходных маркеров
    const storedMarkers = JSON.parse(localStorage.getItem('markers')) || markers;
    setMarkers(storedMarkers);

    // Инициализация карты Leaflet
    const map = L.map('map').setView([47.2357, 39.7015], 12);

    // Добавление слоя тайлов OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; OpenStreetMap contributors',
      maxZoom: 20,
    }).addTo(map);

    // Создание пользовательской иконки маркера
    const markerIcon = L.icon({
      iconUrl: markerIconUrl,
      iconSize: [32, 40],
    });

    // Добавление маркеров на карту
    storedMarkers.forEach(markerData => {
      const { name, coordinates } = markerData;
      const marker = L.marker(coordinates, { icon: markerIcon }).addTo(map);
      marker.bindPopup(name);
    });

    // Функция очистки для удаления карты при размонтировании компонента
    return () => {
      map.remove();
    };
  }, [markers]);


  const handleMarkerFormSubmit = values => {
    const latitude = parseFloat(values.latitude);
    const longitude = parseFloat(values.longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      // Отображение сообщения об ошибке при неверных координатах
      message.error('Неверные координаты. Пожалуйста, введите числовые значения для широты и долготы.');
      return;
    }

    // Создание нового объекта маркера
    const newMarker = {
      name: values.name,
      coordinates: [latitude, longitude],
    };

    // Обновление состояния маркеров и сохранение в localStorage
    const updatedMarkers = [...markers, newMarker];
    localStorage.setItem('markers', JSON.stringify(updatedMarkers));
    setMarkers(updatedMarkers);

    // Скрытие модального окна после добавления маркера
    setIsModalVisible(false);
  };

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '90vh' }} />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>Добавить объект</Button>
      </div>

      <Modal
        title="Добавить объект"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleMarkerFormSubmit}>
          <Form.Item label="Название" name="name" rules={[{ required: true, message: 'Введите название' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Широта" name="latitude" rules={[{ required: true, message: 'Введите широту' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Долгота" name="longitude" rules={[{ required: true, message: 'Введите долготу' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Добавить</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Map;
