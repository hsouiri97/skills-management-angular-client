import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  date: Date = new Date();

  visitSaleChartData = [
    {
      label: "CHN",
      data: [20, 40, 15, 35, 25, 50, 30, 20],
      borderWidth: 1,
      fill: false,
    },
    {
      label: "USA",
      data: [40, 30, 20, 10, 50, 15, 35, 40],
      borderWidth: 1,
      fill: false,
    },
    {
      label: "UK",
      data: [70, 10, 30, 40, 25, 50, 15, 30],
      borderWidth: 1,
      fill: false,
    },
  ];

  visitSaleChartLabels = ["2013", "2014", "2014", "2015", "2016", "2017"];

  visitSaleChartOptions = {
    responsive: true,
    legend: false,
    scales: {
      yAxes: [
        {
          ticks: {
            display: false,
            min: 0,
            stepSize: 20,
            max: 80,
          },
          gridLines: {
            drawBorder: false,
            color: "rgba(235,237,242,1)",
            zeroLineColor: "rgba(235,237,242,1)",
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: false,
            drawBorder: false,
            color: "rgba(0,0,0,1)",
            zeroLineColor: "rgba(235,237,242,1)",
          },
          ticks: {
            padding: 20,
            fontColor: "#9c9fa6",
            autoSkip: true,
          },
          categoryPercentage: 0.4,
          barPercentage: 0.4,
        },
      ],
    },
  };

  visitSaleChartColors = [
    {
      backgroundColor: [
        "rgba(154, 85, 255, 1)",
        "rgba(154, 85, 255, 1)",
        "rgba(154, 85, 255, 1)",
        "rgba(154, 85, 255, 1)",
        "rgba(154, 85, 255, 1)",
        "rgba(154, 85, 255, 1)",
      ],
      borderColor: [
        "rgba(154, 85, 255, 1)",
        "rgba(154, 85, 255, 1)",
        "rgba(154, 85, 255, 1)",
        "rgba(154, 85, 255, 1)",
        "rgba(154, 85, 255, 1)",
        "rgba(154, 85, 255, 1)",
      ],
    },
    {
      backgroundColor: [
        "rgba(254, 112, 150, 1)",
        "rgba(254, 112, 150, 1)",
        "rgba(254, 112, 150, 1)",
        "rgba(254, 112, 150, 1)",
        "rgba(254, 112, 150, 1)",
        "rgba(254, 112, 150, 1)",
      ],
      borderColor: [
        "rgba(254, 112, 150, 1)",
        "rgba(254, 112, 150, 1)",
        "rgba(254, 112, 150, 1)",
        "rgba(254, 112, 150, 1)",
        "rgba(254, 112, 150, 1)",
        "rgba(254, 112, 150, 1)",
      ],
    },
    {
      backgroundColor: [
        "rgba(177, 148, 250, 1)",
        "rgba(177, 148, 250, 1)",
        "rgba(177, 148, 250, 1)",
        "rgba(177, 148, 250, 1)",
        "rgba(177, 148, 250, 1)",
        "rgba(177, 148, 250, 1)",
      ],
      borderColor: [
        "rgba(177, 148, 250, 1)",
        "rgba(177, 148, 250, 1)",
        "rgba(177, 148, 250, 1)",
        "rgba(177, 148, 250, 1)",
        "rgba(177, 148, 250, 1)",
        "rgba(177, 148, 250, 1)",
      ],
    },
  ];

  trafficChartData = [
    {
      data: [10, 30, 40, 15, 5],
    },
  ];

  trafficChartLabels = [
    "Conseil en stratégie de test",
    "Tests fonctionnels",
    "Définition des scénarios des Tests",
    "Automatisation de Test",
    "Tests de performance",
  ];

  trafficChartOptions = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    legend: false,
  };

  trafficChartColors = [
    {
      backgroundColor: [
        "rgba(177, 148, 250, 1)",
        "rgba(254, 112, 150, 1)",
        "rgba(132, 217, 210, 1)",
        "rgba(20, 137,241, 208)",
        "rgba(247, 185, 6, 46)",
      ],
      borderColor: [
        "rgba(177, 148, 250, .2)",
        "rgba(254, 112, 150, .2)",
        "rgba(132, 217, 210, .2)",
        "rgba(20, 137,241, 208)",
        "rgba(247, 185, 6, 46)",
      ],
    },
  ];
  trafficChartData1 = [
    {
      data: [30, 30, 40],
    },
  ];

  trafficChartLabels1 = [
    "Helpdesk sur applications d’entreprise",
    "Gestion des incidents & problèmes",
    "Gestion des demandes de changements",
  ];

  trafficChartOptions1 = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    legend: false,
  };

  trafficChartColors1 = [
    {
      backgroundColor: [
        "rgba(177, 148, 250, 1)",
        "rgba(254, 112, 150, 1)",
        "rgba(132, 217, 210, 1)",
      ],
      borderColor: [
        "rgba(177, 148, 250, .2)",
        "rgba(254, 112, 150, .2)",
        "rgba(132, 217, 210, .2)",
      ],
    },
  ];
  trafficChartData2 = [
    {
      data: [30, 30, 40],
    },
  ];

  trafficChartLabels2 = [
    "Helpdesk sur applications d’entreprise",
    "Gestion des incidents & problèmes",
    "Gestion des demandes de changements",
  ];

  trafficChartOptions2 = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    legend: false,
  };

  trafficChartColors2 = [
    {
      backgroundColor: [
        "rgba(177, 148, 250, 1)",
        "rgba(254, 112, 150, 1)",
        "rgba(132, 217, 210, 1)",
      ],
      borderColor: [
        "rgba(177, 148, 250, .2)",
        "rgba(254, 112, 150, .2)",
        "rgba(132, 217, 210, .2)",
      ],
    },
  ];
  trafficChartData3 = [
    {
      data: [20, 30, 40, 10],
    },
  ];

  trafficChartLabels3 = [
    "Conception : infrastructure système et réseau",
    "Build : Déploiement, gestion de changement des systèmes et réseaux",
    "Run : Gestion des incidents, configuration, performance management",
    "Support : Support technique 1-2-3, 24×7",
  ];

  trafficChartOptions3 = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    legend: false,
  };

  trafficChartColors3 = [
    {
      backgroundColor: [
        "rgba(177, 148, 250, 1)",
        "rgba(254, 112, 150, 1)",
        "rgba(132, 217, 210, 1)",
        "rgba(20, 137,241, 208)",
      ],
      borderColor: [
        "rgba(177, 148, 250, .2)",
        "rgba(254, 112, 150, .2)",
        "rgba(132, 217, 210, .2)",
        "rgba(20, 137,241, 208)",
      ],
    },
  ];
  barChartData = [
    {
      data: [200, 250, 50, 100, 75, 25],
      borderWidth: 1,
      fill: false,
    },
  ];

  barChartLabels = [
    "2 ans <",
    "5 ans <",
    "10 ans <",
    "15 ans <",
    "20 ans <",
    "+20 ans",
  ];

  barChartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  barChartColors = [
    {
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255,99,132,1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
    },
  ];
}
