'use strict';

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

angular.module('DashSourcesService', ['ngResource'])
    .factory('sources', function($resource){
        return $resource('app/sources.json', {}, {
            query: {method:'GET', isArray:false}
        });
    });

angular.module('DashContributorsService', ['ngResource'])
    .factory('contributors', function($resource){
        return $resource('app/contributors.json', {}, {
            query: {method:'GET', isArray:false}
        });
    });


var app = angular.module('DashPlayer', ['DashSourcesService', 'DashContributorsService']);

app.directive('chart', function() {
    return {
        restrict: 'E', // 作为元素名使用
        link: function ($scope, elem, attrs) {

            if (!$scope.chart) {

                $scope.options = {
                    legend: {
                        noColumns: 3,
                        placement: 'outsideGrid',
                        container: $('#legend-wrapper')
                        //labelFormatter: function(label, series) {
                        //    return '<a href="#" ng-click="onChartLegendClick">'+label+'</a>';
                        //}
                    },
                    series: {
                        lines: {
                            show: true,
                            lineWidth: 2,
                            shadowSize: 1,
                            steps: false,
                            fill: false,
                        },
                        points: {
                            radius: 4,
                            fill: true,
                            show: true
                        },
                    },
                    // series: { shadowSize: 3 },
                    xaxis: {
                        show: true,
                        tickDecimals:0
                    },
                    yaxis: {
                        show: true,
                        ticks: 5,
                        position: 'right',
                        min:0,
                        tickDecimals:0,
                        axisLabelPadding: 20
                    },
                    yaxes: [{axisLabel: 'Video Buffer Level'} ,{axisLabel: 'Video Bitrate (kbps)'}  ]
                };

                $scope.chart = $.plot(elem, [], $scope.options);
                $scope.invalidateDisplay(true);
            }

            $scope.chartLegendClick = function(label) {
                alert(label)
            }

            $scope.$watch('invalidateChartDisplay', function(v) {
                if (v && $scope.chart) {
                    var data = $scope[attrs.ngModel];
                    $scope.chart.setData(data);
                    $scope.drawChart = true;
                    $scope.invalidateDisplay(false);
                }
            });

            $scope.$watch('drawChart', function (v) {
                if (v && $scope.chart) {
                    $scope.chart.setupGrid();
                    $scope.chart.draw();
                    $scope.drawChart = false;
                }
            });

            $(window).resize(function () {
                $scope.chart.resize();
                $scope.drawChart = true;
                $scope.chart2.resize();
                $scope.drawChart2 = true;
                $scope.safeApply();
            });
        }
    };
});

app.directive('chart2', function() {
  return {
      restrict: 'E', // 作为元素名使用
      link: function ($scope, elem, attrs) {

          if (!$scope.chart2) {

              $scope.options2 = {
                  legend: {
                      noColumns: 3,
                      placement: 'outsideGrid',
                      container: $('#legend-wrapper')
                      //labelFormatter: function(label, series) {
                      //    return '<a href="#" ng-click="onChartLegendClick">'+label+'</a>';
                      //}
                  },
                  series: {
                      lines: {
                          show: true,
                          lineWidth: 2,
                          shadowSize: 1,
                          steps: false,
                          fill: false,
                      },
                      points: {
                          radius: 4,
                          fill: true,
                          show: true
                      },
                  },
                  // series: { shadowSize: 3 },
                  xaxis: {
                      show: true,
                      tickDecimals:0
                  },
                  yaxis: {
                      show: true,
                      ticks: 5,
                      position: 'right',
                      min:0,
                      tickDecimals:0,
                      axisLabelPadding: 20
                  },
                  yaxes: [{axisLabel: 'Video Buffer Level'} ,{axisLabel: 'Video Bitrate (kbps)'}  ]
              };

              $scope.chart2 = $.plot(elem, [], $scope.options2);
              $scope.invalidateDisplay2(true);
          }

          $scope.$watch('invalidateChartDisplay2', function(v) {
              if (v && $scope.chart2) {
                  var data = $scope[attrs.ngModel];
                  $scope.chart2.setData(data);
                  $scope.drawChart2 = true;
                  $scope.invalidateDisplay2(false);
              }
          });

          $scope.$watch('drawChart2', function (v) {
              if (v && $scope.chart2) {
                  $scope.chart2.setupGrid();
                  $scope.chart2.draw();
                  $scope.drawChart2 = false;
              }
          });
      }
  };
});

app.controller('DashController', function($scope, sources, contributors) {

    $scope.selectedItem = {url:"https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd"};
    $scope.abr_algorithms = {0: 'Default', 1: 'Fixed Rate (0)', 2: 'Buffer Based', 3: 'Rate Based', 4: 'RL', 5: 'Festive', 6: 'Bola'};
    $scope.abr_id = 4;
    $scope.demo = "smooth";
    $scope.abrEnabled = true;
    $scope.toggleCCBubble = false;
    $scope.debugEnabled = false;
    $scope.htmlLogging = false;
    $scope.videotoggle = false;
    $scope.audiotoggle = false;
    $scope.optionsGutter = false;
    $scope.drmData = [];
    $scope.initialSettings = {audio: null, video: null};
    $scope.mediaSettingsCacheEnabled = true;
    $scope.invalidateChartDisplay = false;
    $scope.invalidateChartDisplay2 = false;
    $scope.chartEnabled = true;
    $scope.metricsTimer = null;
    $scope.metricsTimer2 = null;
    $scope.maxGraphPoints = 50;
    $scope.updateMetricsInterval = 1000;
    $scope.audioGraphColor = "#E74C3C"
    $scope.videoGraphColor = "#2980B9"
    //metrics
    $scope.videoBitrate = 0;
    $scope.videoIndex = 0;
    $scope.videoPendingIndex = 0;
    $scope.videoMaxIndex = 0;
    $scope.videoBufferLength = 0;
    $scope.videoDroppedFrames = 0;
    $scope.videoLatencyCount = 0;
    $scope.videoLatency = "";
    $scope.videoDownloadCount = 0;
    $scope.videoDownload = "";
    $scope.videoRatioCount = 0;
    $scope.videoRatio = "";

    $scope.audioBitrate = 0;
    $scope.audioIndex = 0;
    $scope.audioPendingIndex = "";
    $scope.audioMaxIndex = 0;
    $scope.audioBufferLength = 0;
    $scope.audioDroppedFrames = 0;
    $scope.audioLatencyCount = 0;
    $scope.audioLatency = "";
    $scope.audioDownloadCount = 0;
    $scope.audioDownload = "";
    $scope.audioRatioCount = 0;
    $scope.audioRatio = "";

    ////////////////////////////////////////
    //
    // Player Setup
    //
    ////////////////////////////////////////
    $scope.isLoad = false
    $scope.playAll = function () {
      var span = $('#icon-change')
      if ($scope.isLoad) {
        $scope.chartEnabled = !$scope.chartEnabled
        if ($scope.player.isPaused()) {
            span.removeClass('icon-play');
            span.addClass('icon-pause');
            $scope.player.play()
            $scope.player2.play()
        } else {
            span.removeClass('icon-pause')
            span.addClass('icon-play');
            $scope.player.pause()
            $scope.player2.pause()
        }
      } else {
        $scope.doLoad()
        $scope.isLoad = true
        span.removeClass('icon-play');
        span.addClass('icon-pause');
      }
    }
    $scope.changeUrl = function(index) {
      if (index == 1) {
        $('.tab-up-wrapper').attr('class', 'tab-up-wrapper active');
        $('.tab-bottom-wrapper').attr('class', 'tab-bottom-wrapper')
        $('.tab-up').attr('class', 'tab-up active');
        $('.tab-bottom').attr('class', 'tab-bottom');
        location.href = './deecamp.html'
      } else {
        $('.tab-up-wrapper').attr('class', 'tab-up-wrapper');
        $('.tab-bottom-wrapper').attr('class', 'tab-bottom-wrapper active');
        $('.tab-up').attr('class', 'tab-up');
        $('.tab-bottom').attr('class', 'tab-bottom active');
        location.href = './deecamp_1.html'
      }
    }
    $scope.video = document.querySelector(".dash-video-player video");
    $scope.video2 = document.querySelector(".dash-video-player2 video");
    $scope.player = dashjs.MediaPlayer().create();
    $scope.player2 = dashjs.MediaPlayer().create();
    $scope.player.initialize($scope.video, null, true);
    $scope.player2.initialize($scope.video2, null, true);
    $scope.player.setFastSwitchEnabled(true);
    $scope.player2.setFastSwitchEnabled(true);
    $scope.player.attachVideoContainer(document.getElementById("videoContainer"));
    $scope.player2.attachVideoContainer(document.getElementById("videoContainer2"));
    // Add HTML-rendered TTML subtitles except for Firefox (issue #1164)
    if (typeof navigator !== 'undefined' && !navigator.userAgent.match(/Firefox/)) {
        $scope.player.attachTTMLRenderingDiv($("#video-caption")[0]);
    }

    $scope.controlbar = new ControlBar($scope.player);
    $scope.controlbar2 = new ControlBar($scope.player2);
    $scope.controlbar.initialize();
    $scope.controlbar2.initialize(2); // id后面都跟2
    $scope.controlbar.disable();
    $scope.controlbar2.disable();

    ////////////////////////////////////////
    //
    // Page Setup
    //
    ////////////////////////////////////////
    $scope.version = $scope.player.getVersion();

    sources.query(function (data) {
        $scope.availableStreams = data.items;
    });

    contributors.query(function (data) {
        $scope.contributors = data.items;
    });
    ////////////////////////////////////////
    //
    // Player Events
    //
    ////////////////////////////////////////

    $scope.player.on(dashjs.MediaPlayer.events.ERROR, function (e) {}, $scope);
    $scope.player2.on(dashjs.MediaPlayer.events.ERROR, function (e) {}, $scope);

    $scope.player.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_REQUESTED, function (e) {
        $scope[e.mediaType + "Index"] = e.oldQuality + 1 ;
        $scope[e.mediaType+ "PendingIndex"] = e.newQuality + 1;
    }, $scope);

    $scope.player.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_RENDERED, function (e) {
        $scope[e.mediaType + "Index"] = e.newQuality + 1;
        $scope[e.mediaType + "PendingIndex"] = e.newQuality + 1;
    }, $scope);

    $scope.player.on(dashjs.MediaPlayer.events.PERIOD_SWITCH_COMPLETED, function (e) {
        $scope.streamInfo = e.toStreamInfo;
    }, $scope);

    $scope.player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, function (e) {
        clearInterval($scope.metricsTimer);
        $scope.metricsTimer = setInterval(function () {
            updateMetrics("video");
            updateMetrics("audio");
            updateMetrics2("video");
            updateMetrics2("audio");
            //updateMetrics("text");
        }, $scope.updateMetricsInterval)
    }, $scope);

    $scope.player.on(dashjs.MediaPlayer.events.PLAYBACK_ENDED, function(e) {
        if ($('#loop-cb').is(':checked') &&
            $scope.player.getActiveStream().getStreamInfo().isLast) {
            $scope.doLoad();
        }
    }, $scope);

    $scope.player2.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_REQUESTED, function (e) {
        $scope[e.mediaType + "Index"] = e.oldQuality + 1 ;
        $scope[e.mediaType+ "PendingIndex"] = e.newQuality + 1;
    }, $scope);

    $scope.player2.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_RENDERED, function (e) {
        $scope[e.mediaType + "Index"] = e.newQuality + 1;
        $scope[e.mediaType + "PendingIndex"] = e.newQuality + 1;
    }, $scope);

    $scope.player2.on(dashjs.MediaPlayer.events.PERIOD_SWITCH_COMPLETED, function (e) {
        $scope.streamInfo = e.toStreamInfo;
    }, $scope);

    $scope.player2.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, function (e) {
        clearInterval($scope.metricsTimer2);
        $scope.metricsTimer2 = setInterval(function () {
            updateMetrics2("video");
            updateMetrics2("audio");
            //updateMetrics2("text");
        }, $scope.updateMetricsInterval)
    }, $scope);

    $scope.player2.on(dashjs.MediaPlayer.events.PLAYBACK_ENDED, function(e) {
        if ($('#loop-cb').is(':checked') &&
            $scope.player2.getActiveStream().getStreamInfo().isLast) {
            $scope.doLoad();
        }
    }, $scope);

    ////////////////////////////////////////
    //
    // General Player Methods
    //
    ////////////////////////////////////////

    $scope.toggleAutoPlay = function () {
        $scope.player.setAutoPlay($scope.autoPlaySelected);
    }

    $scope.toggleBufferOccupancyABR = function () {
        $scope.player.enableBufferOccupancyABR($scope.bolaSelected);
    }

    $scope.toggleFastSwitch = function () {
        $scope.player.setFastSwitchEnabled($scope.fastSwitchSelected);
    }

    $scope.toggleLocalStorage = function () {
        $scope.player.enableLastBitrateCaching($scope.localStorageSelected);
        $scope.player.enableLastMediaSettingsCaching($scope.localStorageSelected);
    }

    $scope.initializeRlLinear = function () {
        $scope.player.enablerlABR(true);

        // uncomment this block if you want to change the buffer size that dash tries to maintain
        $scope.player.setBufferTimeAtTopQuality(60);
        $scope.player.setStableBufferTime(60);
        $scope.player.setBufferToKeep(60);
        $scope.player.setBufferPruningInterval(60);

        $scope.player.setAbrAlgorithm(4);

        console.log('PLAYER 1 NOW Using default RL linear reward model');
    }

    $scope.initializeBOLA = function () {
        $scope.player2.enablerlABR(true);

        // uncomment this block if you want to change the buffer size that dash tries to maintain
        $scope.player2.setBufferTimeAtTopQuality(60);
        $scope.player2.setStableBufferTime(60);
        $scope.player2.setBufferToKeep(60);
        $scope.player2.setBufferPruningInterval(60);

        $scope.player2.setAbrAlgorithm(6);

        console.log('PLAYER 2 NOW Using BOLA');
    }

    $scope.TransBarValue = function() {
        var x = document.getElementById("processbar").value;
        if (0 <= x && x <= 10/3){
            $scope.player.setAbrAlgorithm(4);
            document.getElementsByClassName("demo").innerHTML = "smooth";
            $scope.demo = "smooth";
            console.log('NOW change to default RL linear reward model');
        }
        else if (10/3 < x && x <= 20/3){
            $scope.player.setAbrAlgorithm(7);
            document.getElementsByClassName("demo").innerHTML = "balanced";
            $scope.demo = "balanced";
            console.log('NOW change to RL log scale reward model');
        }
        else{
            $scope.player.setAbrAlgorithm(8);
            document.getElementsByClassName("demo").innerHTML = "HD";
            $scope.demo = "HD";
            console.log('NOW change to RL HD reward model');
        }
    }

    $scope.setrlLinear = function () {
        $scope.player.setAbrAlgorithm(4);
        console.log('PLAYER 1 NOW change to default RL linear reward model');
    }

    $scope.setrlLog = function () {
        $scope.player.setAbrAlgorithm(7);
        console.log('PLAYER 1 NOW change to RL log scale reward model');
    }

    $scope.setrlHD = function () {
        $scope.player.setAbrAlgorithm(8);
        console.log('PLAYER 1 NOW change to RL HD reward model');
    }

    $scope.setStream = function (item) {
        $scope.selectedItem = item;
    }

    $scope.toggleOptionsGutter = function (bool) {
        $scope.optionsGutter = bool;
    }

    $scope.doLoad = function () {

        var protData = null;
        if ($scope.selectedItem.hasOwnProperty("protData")) {
            protData = $scope.selectedItem.protData;
        }



        $scope.setChartInfo();

        $scope.controlbar.reset();
        $scope.controlbar2.reset();
        $scope.player.setProtectionData(protData);
        $scope.player.attachSource($scope.selectedItem.url); // 修改视频url
        $scope.player2.setProtectionData(protData);
        $scope.player2.attachSource($scope.selectedItem.url); // 修改视频url
        if ($scope.initialSettings.audio) {
            $scope.player.setInitialMediaSettingsFor("audio", {lang: $scope.initialSettings.audio});
            $scope.player2.setInitialMediaSettingsFor("audio", {lang: $scope.initialSettings.audio});
        }
        if ($scope.initialSettings.video) {
            $scope.player.setInitialMediaSettingsFor("video", {role: $scope.initialSettings.video});
            $scope.player2.setInitialMediaSettingsFor("video", {role: $scope.initialSettings.video});
        }
        $scope.controlbar.enable();
        $scope.controlbar2.enable();
        $scope.initializeRlLinear();
        $scope.initializeBOLA();
    }

    $scope.changeTrackSwitchMode = function(mode, type) {
        $scope.player.setTrackSwitchModeFor(type, mode);
        $scope.player2.setTrackSwitchModeFor(type, mode);
    }

    $scope.hasLogo = function (item) {
        return (item.hasOwnProperty("logo") && item.logo !== null && item.logo !== undefined && item.logo !== "");
    }

    $scope.getChartButtonLabel = function () {
        return $scope.chartEnabled ? "Disable" : "Enable";
    }

    $scope.getOptionsButtonLabel = function () {
        return $scope.optionsGutter ? "Hide Options" : "Show Options";
    }

    // from: https://gist.github.com/siongui/4969449
    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest')
            this.$eval(fn);
        else
            this.$apply(fn);
    };

    $scope.invalidateDisplay = function (value) {
        $scope.invalidateChartDisplay = value;
        $scope.safeApply();
    }

    $scope.invalidateDisplay2 = function (value) {
      $scope.invalidateChartDisplay2 = value;
      $scope.safeApply();
  }

    $scope.setChartInfo = function () {
        $scope.sessionStartTime = new Date().getTime()/1000;

        clearInterval($scope.metricsTimer);
        clearInterval($scope.metricsTimer2);
        $scope.graphPoints = {videobufferlevel: [], videobitrate: [], audio: [], text: []};
        $scope.graphPoints2 = {videobufferlevel: [], videobitrate: [], audio: [], text: []};
        $scope.chartData = [
            {
                data: $scope.graphPoints.videobufferlevel,
                label: "Video Buffer Level",
                color: $scope.videoGraphColor,
                yaxis: 1,
            },
            {
                data: $scope.graphPoints.videobitrate,
                label: "Video Bit Rate",
                color: $scope.audioGraphColor,
                yaxis: 2,
            }
            //,
            //{
            //    data: $scope.graphPoints.text,
            //    label: "Text",
            //    color: "#888"
            //}
        ];
        $scope.chartData2 = [
            {
                data: $scope.graphPoints2.videobufferlevel,
                label: "Video Buffer Level",
                color: $scope.videoGraphColor,
                yaxis: 1,
            },
            {
                data: $scope.graphPoints2.videobitrate,
                label: "Video Bit Rate",
                color: $scope.audioGraphColor,
                yaxis: 2,
            }
            //,
            //{
            //    data: $scope.graphPoints.text,
            //    label: "Text",
            //    color: "#888"
            //}
        ];
    }

    ////////////////////////////////////////
    //
    // Metrics
    //
    ////////////////////////////////////////
    function calculateHTTPMetrics(type, requests) {

        var latency = {},
            download = {},
            ratio = {};

        var requestWindow = requests.slice(-20).filter(function (req) {
            return req.responsecode >= 200 && req.responsecode < 300 && req.type === "MediaSegment" && req._stream === type && !!req._mediaduration;
        }).slice(-4);

        if (requestWindow.length > 0) {

            var latencyTimes = requestWindow.map(function (req){ return Math.abs(req.tresponse.getTime() - req.trequest.getTime()) / 1000;});

            latency[type] = {
                average: latencyTimes.reduce(function(l, r) {return l + r;}) / latencyTimes.length,
                high: latencyTimes.reduce(function(l, r) {return l < r ? r : l;}),
                low: latencyTimes.reduce(function(l, r) {return l < r ? l : r;}),
                count: latencyTimes.length
            };

            var downloadTimes = requestWindow.map(function (req){return Math.abs(req._tfinish.getTime() - req.tresponse.getTime()) / 1000;});

            download[type] = {
                average: downloadTimes.reduce(function(l, r) {return l + r;}) / downloadTimes.length,
                high: downloadTimes.reduce(function(l, r) {return l < r ? r : l;}),
                low: downloadTimes.reduce(function(l, r) {return l < r ? l : r;}),
                count: downloadTimes.length
            };

            var durationTimes = requestWindow.map(function (req){ return req._mediaduration;});

            ratio[type] = {
                average: (durationTimes.reduce(function(l, r) {return l + r;}) / downloadTimes.length) / download[type].average,
                high: durationTimes.reduce(function(l, r) {return l < r ? r : l;}) / download[type].low,
                low: durationTimes.reduce(function(l, r) {return l < r ? l : r;}) / download[type].high,
                count: durationTimes.length
            };

            return {latency: latency, download: download, ratio: ratio}

        }
        return null;
    };

    function updateMetrics(type) {

        var metrics = $scope.player.getMetricsFor(type);
        var dashMetrics = $scope.player.getDashMetrics();

        if (metrics && dashMetrics && $scope.streamInfo) {

            var periodIdx = $scope.streamInfo.index;
            var repSwitch = dashMetrics.getCurrentRepresentationSwitch(metrics);
            var bufferLevel = dashMetrics.getCurrentBufferLevel(metrics);
            var bitrate = repSwitch ? Math.round(dashMetrics.getBandwidthForRepresentation(repSwitch.to, periodIdx) / 1000) : NaN;

            $scope[type + "BufferLength"] = bufferLevel;
            $scope[type + "MaxIndex"] = dashMetrics.getMaxIndexForBufferType(type, periodIdx);
            $scope[type + "Bitrate"] = Math.round(dashMetrics.getBandwidthForRepresentation(repSwitch.to, periodIdx) / 1000);
            $scope[type + "DroppedFrames"] = dashMetrics.getCurrentDroppedFrames(metrics) ? dashMetrics.getCurrentDroppedFrames(metrics).droppedFrames : 0;

            var httpMetrics = calculateHTTPMetrics(type, dashMetrics.getHttpRequests(metrics));
            if (httpMetrics) {
                $scope[type + "Download"] = httpMetrics.download[type].low.toFixed(2) + " | " + httpMetrics.download[type].average.toFixed(2) + " | " + httpMetrics.download[type].high.toFixed(2);
                $scope[type + "Latency"] = httpMetrics.latency[type].low.toFixed(2) + " | " + httpMetrics.latency[type].average.toFixed(2) + " | " + httpMetrics.latency[type].high.toFixed(2);
                $scope[type + "Ratio"] = httpMetrics.ratio[type].low.toFixed(2) + " | " + httpMetrics.ratio[type].average.toFixed(2) + " | " + httpMetrics.ratio[type].high.toFixed(2);
            }

            if ($scope.chartEnabled) {
                var chartTime = (new Date().getTime() / 1000 ) -  $scope.sessionStartTime;
                var point_bl = [parseInt(chartTime).toFixed(1), Math.round(parseFloat(bufferLevel))];
                var point_br = [parseInt(chartTime).toFixed(1), Math.round(parseFloat(bitrate))];
                // $scope.graphPoints[type].push(point);
                if(type === "video"){
                    $scope.graphPoints[type + 'bufferlevel'].push(point_bl);
                    $scope.graphPoints[type + 'bitrate'].push(point_br);
                    if ($scope.graphPoints[type + 'bufferlevel'].length > $scope.maxGraphPoints) {
                        $scope.graphPoints[type + 'bufferlevel'].splice(0, 1);
                        $scope.graphPoints[type + 'bitrate'].splice(0, 1);
                    }
                }
            }
        }

        $scope.invalidateDisplay(true);
    }

    function updateMetrics2(type) {
        var metrics = $scope.player2.getMetricsFor(type);
        var dashMetrics = $scope.player2.getDashMetrics();

        if (metrics && dashMetrics && $scope.streamInfo) {

            var periodIdx = $scope.streamInfo.index;
            var repSwitch = dashMetrics.getCurrentRepresentationSwitch(metrics);
            var bufferLevel = dashMetrics.getCurrentBufferLevel(metrics);
            var bitrate = repSwitch ? Math.round(dashMetrics.getBandwidthForRepresentation(repSwitch.to, periodIdx) / 1000) : NaN;

            $scope[type + "BufferLength"] = bufferLevel;
            $scope[type + "MaxIndex"] = dashMetrics.getMaxIndexForBufferType(type, periodIdx);
            $scope[type + "Bitrate"] = Math.round(dashMetrics.getBandwidthForRepresentation(repSwitch.to, periodIdx) / 1000);
            $scope[type + "DroppedFrames"] = dashMetrics.getCurrentDroppedFrames(metrics) ? dashMetrics.getCurrentDroppedFrames(metrics).droppedFrames : 0;

            var httpMetrics = calculateHTTPMetrics(type, dashMetrics.getHttpRequests(metrics));
            if (httpMetrics) {
                $scope[type + "Download"] = httpMetrics.download[type].low.toFixed(2) + " | " + httpMetrics.download[type].average.toFixed(2) + " | " + httpMetrics.download[type].high.toFixed(2);
                $scope[type + "Latency"] = httpMetrics.latency[type].low.toFixed(2) + " | " + httpMetrics.latency[type].average.toFixed(2) + " | " + httpMetrics.latency[type].high.toFixed(2);
                $scope[type + "Ratio"] = httpMetrics.ratio[type].low.toFixed(2) + " | " + httpMetrics.ratio[type].average.toFixed(2) + " | " + httpMetrics.ratio[type].high.toFixed(2);
            }

            if ($scope.chartEnabled) {
                var chartTime = (new Date().getTime() / 1000 ) -  $scope.sessionStartTime;
                var point_bl = [parseInt(chartTime).toFixed(1), Math.round(parseFloat(bufferLevel))];
                var point_br = [parseInt(chartTime).toFixed(1), Math.round(parseFloat(bitrate))];
                // $scope.graphPoints2[type].push(point);
                if(type === "video"){
                    $scope.graphPoints2[type + 'bufferlevel'].push(point_bl);
                    $scope.graphPoints2[type + 'bitrate'].push(point_br);
                    if ($scope.graphPoints2[type + 'bufferlevel'].length > $scope.maxGraphPoints) {
                        $scope.graphPoints2[type + 'bufferlevel'].splice(0, 1);
                        $scope.graphPoints2[type + 'bitrate'].splice(0, 1);
                    }
                }
            }
        }

        $scope.invalidateDisplay2(true);
    }


    ////////////////////////////////////////
    //
    // Init
    //
    ////////////////////////////////////////
    (function init() {
        $scope.setChartInfo();
        function getUrlVars() {
            var vars = {};
            var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                vars[key] = value;
            });
            return vars;
        }

        var vars = getUrlVars();
        var paramUrl = null;

        if (vars && vars.hasOwnProperty("url")) {
            paramUrl = vars.url;
        }

        if (vars && vars.hasOwnProperty("mpd")) {
            paramUrl = vars.mpd;
        }

        if (paramUrl !== null) {
            var startPlayback = false;

            $scope.selectedItem = {};
            $scope.selectedItem.url = paramUrl;

            if (vars.hasOwnProperty("autoplay")) {
                startPlayback = (vars.autoplay === 'true');
            }

            if (startPlayback) {
                $scope.doLoad();
            }
        }
    })();
});
