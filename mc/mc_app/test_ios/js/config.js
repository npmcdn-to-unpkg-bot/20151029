var LotteryClass = LotteryClass || {};
LotteryClass = {
    names: {
        "WBG5FC" : "WBG5分彩",
        "WBGFFC" : "WBG分分彩",
        "WBGMMC" : "WBG秒秒彩",
        "CQSSC" : "重庆时时彩",
        "XJSSC" : "新疆时时彩",
        "GD11Y" : "广东11选5",
        "SD11Y" : "山东11选5",
        "JX11Y" : "江西11选5",
        "BJPK10" : "北京PK10",
        "3DFC" : "3D福彩",
        "HG1F5" : "韩国1.5分彩"
    },
    WBG5FC: {
        ltTab: {
            wx: "五星",
            sx: "四星",
            hsm: "后三码",
            qsm: "前三码",
            zsm: "中三码",
            em: "二码",
            dwd: "定位胆",
            bdd: "不定胆",
            dxds: "大小单双",
            rx: "任选玩法",
            rx2: "任选二",
            rx3: "任选三",
            rx4: "任选四"
        },
        ltMethod: {
            wx: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选复式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选组合"
                },
                zux_z120: {
                    desc: "组120",
                    num: "组选120|0-9|all",
                    name: "五星组选120"
                },
                zux_z60: {
                    desc: "组选60",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选60"
                },
                zux_z30: {
                    desc: "组选30",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选30"
                },
                zux_z20: {
                    desc: "组选20",
                    num: "三重号,单号|0-9|all",
                    name: "五星组选20"
                },
                zux_z10: {
                    desc: "组选10",
                    num: "三重号,二重号|0-9|all",
                    name: "五星组选10"
                },
                zux_z5: {
                    desc: "组选5",
                    num: "四重号,单号|0-9|all",
                    name: "五星组选5"
                }
            },
            sx: {
                zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选复式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选组合"
                },
                zux_z24: {
                    desc: "组选24",
                    num: "组24|0-9|all",
                    name: "四星组选24"
                },
                zux_z12: {
                    desc: "组选12",
                    num: "二重号,单号|0-9|all",
                    name: "四星组选12"
                },
                zux_z6: {
                    desc: "组选6",
                    num: "二重号|0-9|all",
                    name: "四星组选6"
                },
                zux_z4: {
                    desc: "组选4",
                    num: "三重号,单号|0-9|all",
                    name: "四星组选4"
                }
            },
            hsm: {
                zx_fs: {
                    desc: "复式",
                    num: "百位,十位,个位|0-9|all",
                    name: "后三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "后三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "后三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "后三码组选六"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "后三码组选和值"
                }
            },
            qsm: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位|0-9|all",
                    name: "前三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "前三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "前三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "前三码组选六"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "前三码组选和值"
                }
            },
            zsm: {
                zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位|0-9|all",
                    name: "中三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "中三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "中三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "中三码组选六"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "中三码组选和值"
                }
            },
            em: {
                zx_hfs: {
                    desc: "后二直选(复式)",
                    num: "十位,个位|0-9|all",
                    name: "后二直选复式"
                },
                zx_hhz: {
                    desc: "后二直选(和值)",
                    num: "和值|0-18|",
                    name: "后二直选和值"
                },
                zx_qfs: {
                    desc: "前二直选(复式)",
                    num: "万位,千位|0-9|all",
                    name: "前二直选复式"
                },
                zx_qhz: {
                    desc: "前二直选(和值)",
                    num: "和值|0-18|",
                    name: "前二直选和值"
                },
                zux_hfs: {
                    desc: "后二组选(复式)",
                    num: "组选|0-9|all",
                    name: "后二组选复式"
                },
                zux_qfs: {
                    desc: "前二组选(复式)",
                    num: "组选|0-9|all",
                    name: "前二组选复式"
                },
                zux_qhz: {
                    desc: "前二组选(和值)",
                    num: "和值|1-17|",
                    name: "前二组选和值"
                }
            },
            dwd: {
                dwd_dwd: {
                    desc: "定位胆",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "定位胆"
                }
            },
            bdd: {
                bdd_hs1: {
                    desc: "后三一码",
                    num: "不定胆|0-9|all",
                    name: "后三一码不定胆"
                },
                bdd_hs2: {
                    desc: "后三二码",
                    num: "不定胆|0-9|all",
                    name: "后三二码不定胆"
                },
                bdd_qs1: {
                    desc: "前三一码",
                    num: "不定胆|0-9|all",
                    name: "前三一码不定胆"
                },
                bdd_qs2: {
                    desc: "前三二码",
                    num: "不定胆|0-9|all",
                    name: "前三二码不定胆"
                }
            },
            dxds: {
                dxds_h2: {
                    desc: "后二大小单双",
                    num: "十位,个位|0-3|two",
                    name: "后二大小单双"
                },
                dxds_q2: {
                    desc: "前二大小单双",
                    num: "万位,千位|0-3|two",
                    name: "前二大小单双"
                }
            },
            rx2: {
                zx_fs: {
                    desc: "直选复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任二直选复式"
                },
                zx_hz: {
                    desc: "直选和值",
                    num: "直选和值|0-18|",
                    name: "任二直选和值"
                },
                zux_fs: {
                    desc: "组选复式",
                    num: "组选复式|0-9|all",
                    name: "任二组选复式"
                },
                zux_hz: {
                    desc: "组选和值",
                    num: "组选和值|1-17|",
                    name: "任二组选和值"
                }
            },
            rx3: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任三直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "任三直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "任三组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "任三组选六"
                },
                zux_hz: {
                    desc: "组选和值",
                    num: "组选和值|1-26|",
                    name: "任三组选和值"
                }
            },
            rx4: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任四直选复式"
                },
                zux_z24: {
                    desc: "组选24",
                    num: "组24|0-9|all",
                    name: "任四组选24"
                },
                zux_z12: {
                    desc: "组选12",
                    num: "二重号,单号|0-9|all",
                    name: "任四组选12"
                },
                zux_z6: {
                    desc: "组选6",
                    num: "二重号|0-9|all",
                    name: "任四组选6"
                },
                zux_z4: {
                    desc: "组选4",
                    num: "三重号,单号|0-9|all",
                    name: "任四组选4"
                }
            }
        }
    },
    WBGFFC: {
        ltTab: {
            wx: "五星",
            sx: "四星",
            hsm: "后三码",
            qsm: "前三码",
            zsm: "中三码",
            em: "二码",
            dwd: "定位胆",
            bdd: "不定胆",
            dxds: "大小单双"
        },
        ltMethod: {
            wx: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选复式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选组合"
                },
                zux_z120: {
                    desc: "组120",
                    num: "组选120|0-9|all",
                    name: "五星组选120"
                },
                zux_z60: {
                    desc: "组选60",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选60"
                },
                zux_z30: {
                    desc: "组选30",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选30"
                },
                zux_z20: {
                    desc: "组选20",
                    num: "三重号,单号|0-9|all",
                    name: "五星组选20"
                },
                zux_z10: {
                    desc: "组选10",
                    num: "三重号,二重号|0-9|all",
                    name: "五星组选10"
                },
                zux_z5: {
                    desc: "组选5",
                    num: "四重号,单号|0-9|all",
                    name: "五星组选5"
                }
            },
            sx: {
                zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选复式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选组合"
                },
                zux_z24: {
                    desc: "组选24",
                    num: "组24|0-9|all",
                    name: "四星组选24"
                },
                zux_z12: {
                    desc: "组选12",
                    num: "二重号,单号|0-9|all",
                    name: "四星组选12"
                },
                zux_z6: {
                    desc: "组选6",
                    num: "二重号|0-9|all",
                    name: "四星组选6"
                },
                zux_z4: {
                    desc: "组选4",
                    num: "三重号,单号|0-9|all",
                    name: "四星组选4"
                }
            },
            hsm: {
                zx_fs: {
                    desc: "复式",
                    num: "百位,十位,个位|0-9|all",
                    name: "后三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "后三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "后三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "后三码组选六"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "后三码组选和值"
                }
            },
            qsm: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位|0-9|all",
                    name: "前三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "前三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "前三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "前三码组选六"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "前三码组选和值"
                }
            },
            zsm: {
                zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位|0-9|all",
                    name: "中三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "中三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "中三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "中三码组选六"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "中三码组选和值"
                }
            },
            em: {
                zx_hfs: {
                    desc: "后二直选(复式)",
                    num: "十位,个位|0-9|all",
                    name: "后二直选复式"
                },
                zx_hhz: {
                    desc: "后二直选(和值)",
                    num: "和值|0-18|",
                    name: "后二直选和值"
                },
                zx_qfs: {
                    desc: "前二直选(复式)",
                    num: "万位,千位|0-9|all",
                    name: "前二直选复式"
                },
                zx_qhz: {
                    desc: "前二直选(和值)",
                    num: "和值|0-18|",
                    name: "前二直选和值"
                },
                zux_hfs: {
                    desc: "后二组选(复式)",
                    num: "组选|0-9|all",
                    name: "后二组选复式"
                },
                zux_hhz: {
                    desc: "后二组选(和值)",
                    num: "和值|1-17|",
                    name: "后二组选和值"
                },
                zux_qfs: {
                    desc: "前二组选(复式)",
                    num: "组选|0-9|all",
                    name: "前二组选复式"
                },
                zux_qhz: {
                    desc: "前二组选(和值)",
                    num: "和值|1-17|",
                    name: "前二组选和值"
                }
            },
            dwd: {
                dwd_dwd: {
                    desc: "定位胆",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "定位胆"
                }
            },
            bdd: {
                bdd_hs1: {
                    desc: "后三一码",
                    num: "不定胆|0-9|all",
                    name: "后三一码不定胆"
                },
                bdd_hs2: {
                    desc: "后三二码",
                    num: "不定胆|0-9|all",
                    name: "后三二码不定胆"
                },
                bdd_qs1: {
                    desc: "前三一码",
                    num: "不定胆|0-9|all",
                    name: "前三一码不定胆"
                },
                bdd_qs2: {
                    desc: "前三二码",
                    num: "不定胆|0-9|all",
                    name: "前三二码不定胆"
                }
            },
            dxds: {
                dxds_h2: {
                    desc: "后二大小单双",
                    num: "十位,个位|0-3|two",
                    name: "后二大小单双"
                },
                dxds_q2: {
                    desc: "前二大小单双",
                    num: "万位,千位|0-3|two",
                    name: "前二大小单双"
                }
            }
        }
    },
    WBGMMC: {
        ltTab: {
            wx: "五星",
            sx: "四星",
            hsm: "后三码",
            qsm: "前三码",
            zsm: "中三码",
            em: "二码",
            dwd: "定位胆",
            bdd: "不定胆",
            dxds: "大小单双"
        },
        ltMethod: {
            wx: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选复式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选组合"
                },
                zux_z120: {
                    desc: "组120",
                    num: "组选120|0-9|all",
                    name: "五星组选120"
                },
                zux_z60: {
                    desc: "组选60",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选60"
                },
                zux_z30: {
                    desc: "组选30",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选30"
                },
                zux_z20: {
                    desc: "组选20",
                    num: "三重号,单号|0-9|all",
                    name: "五星组选20"
                },
                zux_z10: {
                    desc: "组选10",
                    num: "三重号,二重号|0-9|all",
                    name: "五星组选10"
                },
                zux_z5: {
                    desc: "组选5",
                    num: "四重号,单号|0-9|all",
                    name: "五星组选5"
                }
            },
            sx: {
                zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选复式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选组合"
                },
                zux_z24: {
                    desc: "组选24",
                    num: "组24|0-9|all",
                    name: "四星组选24"
                },
                zux_z12: {
                    desc: "组选12",
                    num: "二重号,单号|0-9|all",
                    name: "四星组选12"
                },
                zux_z6: {
                    desc: "组选6",
                    num: "二重号|0-9|all",
                    name: "四星组选6"
                },
                zux_z4: {
                    desc: "组选4",
                    num: "三重号,单号|0-9|all",
                    name: "四星组选4"
                }
            },
            hsm: {
                zx_fs: {
                    desc: "复式",
                    num: "百位,十位,个位|0-9|all",
                    name: "后三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "后三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "后三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "后三码组选六"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "后三码组选和值"
                }
            },
            qsm: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位|0-9|all",
                    name: "前三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "前三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "前三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "前三码组选六"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "前三码组选和值"
                }
            },
            zsm: {
                zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位|0-9|all",
                    name: "中三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "中三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "中三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "中三码组选六"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "中三码组选和值"
                }
            },
            em: {
                zx_hfs: {
                    desc: "后二直选(复式)",
                    num: "十位,个位|0-9|all",
                    name: "后二直选复式"
                },
                zx_hhz: {
                    desc: "后二直选(和值)",
                    num: "和值|0-18|",
                    name: "后二直选和值"
                },
                zx_qfs: {
                    desc: "前二直选(复式)",
                    num: "万位,千位|0-9|all",
                    name: "前二直选复式"
                },
                zx_qhz: {
                    desc: "前二直选(和值)",
                    num: "和值|0-18|",
                    name: "前二直选和值"
                },
                zux_hfs: {
                    desc: "后二组选(复式)",
                    num: "组选|0-9|all",
                    name: "后二组选复式"
                },
                zux_hhz: {
                    desc: "后二组选(和值)",
                    num: "和值|1-17|",
                    name: "后二组选和值"
                },
                zux_qfs: {
                    desc: "前二组选(复式)",
                    num: "组选|0-9|all",
                    name: "前二组选复式"
                },
                zux_qhz: {
                    desc: "前二组选(和值)",
                    num: "和值|1-17|",
                    name: "前二组选和值"
                }
            },
            dwd: {
                dwd_dwd: {
                    desc: "定位胆",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "定位胆"
                }
            },
            bdd: {
                bdd_hs1: {
                    desc: "后三一码",
                    num: "不定胆|0-9|all",
                    name: "后三一码不定胆"
                },
                bdd_hs2: {
                    desc: "后三二码",
                    num: "不定胆|0-9|all",
                    name: "后三二码不定胆"
                },
                bdd_qs1: {
                    desc: "前三一码",
                    num: "不定胆|0-9|all",
                    name: "前三一码不定胆"
                },
                bdd_qs2: {
                    desc: "前三二码",
                    num: "不定胆|0-9|all",
                    name: "前三二码不定胆"
                }
            },
            dxds: {
                dxds_h2: {
                    desc: "后二大小单双",
                    num: "十位,个位|0-3|two",
                    name: "后二大小单双"
                },
                dxds_q2: {
                    desc: "前二大小单双",
                    num: "万位,千位|0-3|two",
                    name: "前二大小单双"
                }
            }
        }
    },
    HG1F5: {
        ltTab: {
            wx: "五星",
            sx: "四星",
            hsm: "后三码",
            qsm: "前三码",
            zsm: "中三码",
            em: "二码",
            dwd: "定位胆",
            bdd: "不定胆",
            dxds: "大小单双"
        },
        ltMethod: {
            wx: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选复式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选组合"
                },
                zux_z120: {
                    desc: "组选120",
                    num: "组选120|0-9|all",
                    name: "五星组选120"
                },
                zux_z60: {
                    desc: "组选60",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选60"
                },
                zux_z30: {
                    desc: "组选30",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选30"
                },
                zux_z20: {
                    desc: "组选20",
                    num: "三重号,单号|0-9|all",
                    name: "五星组选20"
                },
                zux_z10: {
                    desc: "组选10",
                    num: "三重号,二重号|0-9|all",
                    name: "五星组选10"
                },
                zux_z5: {
                    desc: "组选5",
                    num: "四重号,单号|0-9|all",
                    name: "五星组选5"
                }
            },
            sx: {
                zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选复式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选组合"
                },
                zux_z24: {
                    desc: "组选24",
                    num: "组24|0-9|all",
                    name: "四星组选24"
                },
                zux_z12: {
                    desc: "组选12",
                    num: "二重号,单号|0-9|all",
                    name: "四星组选12"
                },
                zux_z6: {
                    desc: "组选6",
                    num: "二重号|0-9|all",
                    name: "四星组选6"
                },
                zux_z4: {
                    desc: "组选4",
                    num: "三重号,单号|0-9|all",
                    name: "四星组选4"
                }
            },
            hsm: {
                zx_fs: {
                    desc: "复式",
                    num: "百位,十位,个位|0-9|all",
                    name: "后三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "后三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "后三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "后三码组选六"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "后三码组选和值"
                }
            },
            qsm: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位|0-9|all",
                    name: "前三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "前三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "前三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "前三码组选六"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "前三码组选和值"
                }
            },
            zsm: {
                zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位|0-9|all",
                    name: "中三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "中三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "中三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "中三码组选六"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "中三码组选和值"
                }
            },
            em: {
                zx_hfs: {
                    desc: "后二直选(复式)",
                    num: "十位,个位|0-9|all",
                    name: "后二直选复式"
                },
                zx_hhz: {
                    desc: "后二直选(和值)",
                    num: "和值|0-18|",
                    name: "后二直选和值"
                },
                zx_qfs: {
                    desc: "前二直选(复式)",
                    num: "万位,千位|0-9|all",
                    name: "前二直选复式"
                },
                zx_qhz: {
                    desc: "前二直选(和值)",
                    num: "和值|0-18|",
                    name: "前二直选和值"
                },
                zux_hfs: {
                    desc: "后二组选(复式)",
                    num: "组选|0-9|all",
                    name: "后二组选复式"
                },
                zux_hhz: {
                    desc: "后二组选(和值)",
                    num: "和值|1-17|",
                    name: "后二组选和值"
                },
                zux_qfs: {
                    desc: "前二组选(复式)",
                    num: "组选|0-9|all",
                    name: "前二组选复式"
                },
                zux_qhz: {
                    desc: "前二组选(和值)",
                    num: "和值|1-17|",
                    name: "前二组选和值"
                }
            },
            dwd: {
                dwd_dwd: {
                    desc: "定位胆",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "定位胆"
                }
            },
            bdd: {
                bdd_hs1: {
                    desc: "后三一码",
                    num: "不定胆|0-9|all",
                    name: "后三一码不定胆"
                },
                bdd_hs2: {
                    desc: "后三二码",
                    num: "不定胆|0-9|all",
                    name: "后三二码不定胆"
                },
                bdd_qs1: {
                    desc: "前三一码",
                    num: "不定胆|0-9|all",
                    name: "前三一码不定胆"
                },
                bdd_qs2: {
                    desc: "前三二码",
                    num: "不定胆|0-9|all",
                    name: "前三二码不定胆"
                }
            },
            dxds: {
                dxds_h2: {
                    desc: "后二大小单双",
                    num: "十位,个位|0-3|two",
                    name: "后二大小单双"
                },
                dxds_q2: {
                    desc: "前二大小单双",
                    num: "万位,千位|0-3|two",
                    name: "前二大小单双"
                }
            },
            rx2: {
                zx_fs: {
                    desc: "直选复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任二直选复式"
                },
                zx_hz: {
                    desc: "直选和值",
                    num: "直选和值|0-18|",
                    name: "任二直选和值"
                },
                zux_fs: {
                    desc: "组选复式",
                    num: "组选复式|0-9|all",
                    name: "任二组选复式"
                },
                zux_hz: {
                    desc: "组选和值",
                    num: "组选和值|1-17|",
                    name: "任二组选和值"
                }
            },
            rx3: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任三直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "任三直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "任三组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "任三组选六"
                },
                zux_hz: {
                    desc: "组选和值",
                    num: "组选和值|1-26|",
                    name: "任三组选和值"
                }
            },
            rx4: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任四直选复式"
                },
                zux_z24: {
                    desc: "组选24",
                    num: "组24|0-9|all",
                    name: "任四组选24"
                },
                zux_z12: {
                    desc: "组选12",
                    num: "二重号,单号|0-9|all",
                    name: "任四组选12"
                },
                zux_z6: {
                    desc: "组选6",
                    num: "二重号|0-9|all",
                    name: "任四组选6"
                },
                zux_z4: {
                    desc: "组选4",
                    num: "三重号,单号|0-9|all",
                    name: "任四组选4"
                }
            }
        }
    },
    CQSSC: {
        ltTab: {
            wx: "五星",
            sx: "四星",
            hsm: "后三码",
            qsm: "前三码",
            zsm: "中三码",
            em: "二码",
            dwd: "定位胆",
            bdd: "不定胆",
            dxds: "大小单双",
            rx2: "任选二",
            rx3: "任选三",
            rx4: "任选四"
        },
        ltMethod: {
            wx: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选复式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选组合"
                },
                zux_z120: {
                    desc: "组选120",
                    num: "组选120|0-9|all",
                    name: "五星组选120"
                },
                zux_z60: {
                    desc: "组选60",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选60"
                },
                zux_z30: {
                    desc: "组选30",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选30"
                },
                zux_z20: {
                    desc: "组选20",
                    num: "三重号,单号|0-9|all",
                    name: "五星组选20"
                },
                zux_z10: {
                    desc: "组选10",
                    num: "三重号,二重号|0-9|all",
                    name: "五星组选10"
                },
                zux_z5: {
                    desc: "组选5",
                    num: "四重号,单号|0-9|all",
                    name: "五星组选5"
                }
            },
            sx: {
                zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选复式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选组合"
                },
                zux_z24: {
                    desc: "组选24",
                    num: "组24|0-9|all",
                    name: "四星组选24"
                },
                zux_z12: {
                    desc: "组选12",
                    num: "二重号,单号|0-9|all",
                    name: "四星组选12"
                },
                zux_z6: {
                    desc: "组选6",
                    num: "二重号|0-9|all",
                    name: "四星组选6"
                },
                zux_z4: {
                    desc: "组选4",
                    num: "三重号,单号|0-9|all",
                    name: "四星组选4"
                }
            },
            hsm: {
                zx_fs: {
                    desc: "复式",
                    num: "百位,十位,个位|0-9|all",
                    name: "后三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "后三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "后三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "后三码组选六"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "后三码组选和值"
                }
            },
            qsm: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位|0-9|all",
                    name: "前三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "前三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "前三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "前三码组选六"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "前三码组选和值"
                }
            },
            zsm: {
                zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位|0-9|all",
                    name: "中三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "中三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "中三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "中三码组选六"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "中三码组选和值"
                }
            },
            em: {
                zx_hfs: {
                    desc: "后二直选(复式)",
                    num: "十位,个位|0-9|all",
                    name: "后二直选复式"
                },
                zx_hhz: {
                    desc: "后二直选(和值)",
                    num: "和值|0-18|",
                    name: "后二直选和值"
                },
                zx_qfs: {
                    desc: "前二直选(复式)",
                    num: "万位,千位|0-9|all",
                    name: "前二直选复式"
                },
                zx_qhz: {
                    desc: "前二直选(和值)",
                    num: "和值|0-18|",
                    name: "前二直选和值"
                },
                zux_hfs: {
                    desc: "后二组选(复式)",
                    num: "组选|0-9|all",
                    name: "后二组选复式"
                },
                zux_hhz: {
                    desc: "后二组选(和值)",
                    num: "和值|1-17|",
                    name: "后二组选和值"
                },
                zux_qfs: {
                    desc: "前二组选(复式)",
                    num: "组选|0-9|all",
                    name: "前二组选复式"
                },
                zux_qhz: {
                    desc: "前二组选(和值)",
                    num: "和值|1-17|",
                    name: "前二组选和值"
                }
            },
            dwd: {
                dwd_dwd: {
                    desc: "定位胆",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "定位胆"
                }
            },
            bdd: {
                bdd_hs1: {
                    desc: "后三一码",
                    num: "不定胆|0-9|all",
                    name: "后三一码不定胆"
                },
                bdd_hs2: {
                    desc: "后三二码",
                    num: "不定胆|0-9|all",
                    name: "后三二码不定胆"
                },
                bdd_qs1: {
                    desc: "前三一码",
                    num: "不定胆|0-9|all",
                    name: "前三一码不定胆"
                },
                bdd_qs2: {
                    desc: "前三二码",
                    num: "不定胆|0-9|all",
                    name: "前三二码不定胆"
                }
            },
            dxds: {
                dxds_h2: {
                    desc: "后二大小单双",
                    num: "十位,个位|0-3|two",
                    name: "后二大小单双"
                },
                dxds_q2: {
                    desc: "前二大小单双",
                    num: "万位,千位|0-3|two",
                    name: "前二大小单双"
                }
            },
            rx2: {
                zx_fs: {
                    desc: "直选复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任二直选复式"
                },
                zx_hz: {
                    desc: "直选和值",
                    num: "直选和值|0-18|",
                    name: "任二直选和值"
                },
                zux_fs: {
                    desc: "组选复式",
                    num: "组选复式|0-9|all",
                    name: "任二组选复式"
                },
                zux_hz: {
                    desc: "组选和值",
                    num: "组选和值|1-17|",
                    name: "任二组选和值"
                }
            },
            rx3: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任三直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "任三直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "任三组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "任三组选六"
                },
                zux_hz: {
                    desc: "组选和值",
                    num: "组选和值|1-26|",
                    name: "任三组选和值"
                }
            },
            rx4: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任四直选复式"
                },
                zux_z24: {
                    desc: "组选24",
                    num: "组24|0-9|all",
                    name: "任四组选24"
                },
                zux_z12: {
                    desc: "组选12",
                    num: "二重号,单号|0-9|all",
                    name: "任四组选12"
                },
                zux_z6: {
                    desc: "组选6",
                    num: "二重号|0-9|all",
                    name: "任四组选6"
                },
                zux_z4: {
                    desc: "组选4",
                    num: "三重号,单号|0-9|all",
                    name: "任四组选4"
                }
            }
        }
    },
    XJSSC: {
        ltTab: {
            wx: "五星",
            sx: "四星",
            hsm: "后三码",
            qsm: "前三码",
            zsm: "中三码",
            em: "二码",
            dwd: "定位胆",
            bdd: "不定胆",
            dxds: "大小单双",
            rx2: "任选二",
            rx3: "任选三",
            rx4: "任选四"
        },
        ltMethod: {
            wx: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选复式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "五星直选组合"
                },
                zux_z120: {
                    desc: "组选120",
                    num: "组选120|0-9|all",
                    name: "五星组选120"
                },
                zux_z60: {
                    desc: "组选60",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选60"
                },
                zux_z30: {
                    desc: "组选30",
                    num: "二重号,单号|0-9|all",
                    name: "五星组选30"
                },
                zux_z20: {
                    desc: "组选20",
                    num: "三重号,单号|0-9|all",
                    name: "五星组选20"
                },
                zux_z10: {
                    desc: "组选10",
                    num: "三重号,二重号|0-9|all",
                    name: "五星组选10"
                },
                zux_z5: {
                    desc: "组选5",
                    num: "四重号,单号|0-9|all",
                    name: "五星组选5"
                }
            },
            sx: {
                zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选复式"
                },
                zx_zh: {
                    desc: "组合",
                    num: "千位,百位,十位,个位|0-9|all",
                    name: "四星直选组合"
                },
                zux_z24: {
                    desc: "组选24",
                    num: "组24|0-9|all",
                    name: "四星组选24"
                },
                zux_z12: {
                    desc: "组选12",
                    num: "二重号,单号|0-9|all",
                    name: "四星组选12"
                },
                zux_z6: {
                    desc: "组选6",
                    num: "二重号|0-9|all",
                    name: "四星组选6"
                },
                zux_z4: {
                    desc: "组选4",
                    num: "三重号,单号|0-9|all",
                    name: "四星组选4"
                }
            },
            hsm: {
                zx_fs: {
                    desc: "复式",
                    num: "百位,十位,个位|0-9|all",
                    name: "后三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "后三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "后三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "后三码组选六"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "后三码组选和值"
                }
            },
            qsm: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位|0-9|all",
                    name: "前三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "前三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "前三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "前三码组选六"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "前三码组选和值"
                }
            },
            zsm: {
                zx_fs: {
                    desc: "复式",
                    num: "千位,百位,十位|0-9|all",
                    name: "中三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "中三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "中三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "中三码组选六"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "中三码组选和值"
                }
            },
            em: {
                zx_hfs: {
                    desc: "后二直选(复式)",
                    num: "十位,个位|0-9|all",
                    name: "后二直选复式"
                },
                zx_hhz: {
                    desc: "后二直选(和值)",
                    num: "和值|0-18|",
                    name: "后二直选和值"
                },
                zx_qfs: {
                    desc: "前二直选(复式)",
                    num: "万位,千位|0-9|all",
                    name: "前二直选复式"
                },
                zx_qhz: {
                    desc: "前二直选(和值)",
                    num: "和值|0-18|",
                    name: "前二直选和值"
                },
                zux_hfs: {
                    desc: "后二组选(复式)",
                    num: "组选|0-9|all",
                    name: "后二组选复式"
                },
                zux_hhz: {
                    desc: "后二组选(和值)",
                    num: "和值|1-17|",
                    name: "后二组选和值"
                },
                zux_qfs: {
                    desc: "前二组选(复式)",
                    num: "组选|0-9|all",
                    name: "前二组选复式"
                },
                zux_qhz: {
                    desc: "前二组选(和值)",
                    num: "和值|1-17|",
                    name: "前二组选和值"
                }
            },
            dwd: {
                dwd_dwd: {
                    desc: "定位胆",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "定位胆"
                }
            },
            bdd: {
                bdd_hs1: {
                    desc: "后三一码",
                    num: "不定胆|0-9|all",
                    name: "后三一码不定胆"
                },
                bdd_hs2: {
                    desc: "后三二码",
                    num: "不定胆|0-9|all",
                    name: "后三二码不定胆"
                },
                bdd_qs1: {
                    desc: "前三一码",
                    num: "不定胆|0-9|all",
                    name: "前三一码不定胆"
                },
                bdd_qs2: {
                    desc: "前三二码",
                    num: "不定胆|0-9|all",
                    name: "前三二码不定胆"
                }
            },
            dxds: {
                dxds_h2: {
                    desc: "后二大小单双",
                    num: "十位,个位|0-3|two",
                    name: "后二大小单双"
                },
                dxds_q2: {
                    desc: "前二大小单双",
                    num: "万位,千位|0-3|two",
                    name: "前二大小单双"
                }
            },
            rx2: {
                zx_fs: {
                    desc: "直选复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任二直选复式"
                },
                zx_hz: {
                    desc: "直选和值",
                    num: "直选和值|0-18|",
                    name: "任二直选和值"
                },
                zux_fs: {
                    desc: "组选复式",
                    num: "组选复式|0-9|all",
                    name: "任二组选复式"
                },
                zux_hz: {
                    desc: "组选和值",
                    num: "组选和值|1-17|",
                    name: "任二组选和值"
                }
            },
            rx3: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任三直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "任三直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "任三组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "任三组选六"
                },
                zux_hz: {
                    desc: "组选和值",
                    num: "组选和值|1-26|",
                    name: "任三组选和值"
                }
            },
            rx4: {
                zx_fs: {
                    desc: "复式",
                    num: "万位,千位,百位,十位,个位|0-9|all",
                    name: "任四直选复式"
                },
                zux_z24: {
                    desc: "组选24",
                    num: "组24|0-9|all",
                    name: "任四组选24"
                },
                zux_z12: {
                    desc: "组选12",
                    num: "二重号,单号|0-9|all",
                    name: "任四组选12"
                },
                zux_z6: {
                    desc: "组选6",
                    num: "二重号|0-9|all",
                    name: "任四组选6"
                },
                zux_z4: {
                    desc: "组选4",
                    num: "三重号,单号|0-9|all",
                    name: "任四组选4"
                }
            }
        }
    },
    GD11Y: {
        ltTab: {
            sm: "三码",
            em: "二码",
            bdd: "不定胆",
            dwd: "定位胆",
            rxfs: "任选复式"
        },
        ltMethod: {
            sm: {
                sm_zxfs: {
                    desc: "前三直选复式",
                    num: "第一位,第二位,第三位|1-11|all",
                    name: "前三直选复式"
                },
                sm_zuxfs: {
                    desc: "前三组选复式",
                    num: "前三组选|1-11|all",
                    name: "前三组选复式"
                }
            },
            em: {
                em_zxfs: {
                    desc: "前二直选复式",
                    num: "第一位,第二位|1-11|all",
                    name: "前二直选复式"
                },
                em_zuxfs: {
                    desc: "前二组选复式",
                    num: "前二组选|1-11|all",
                    name: "前二组选复式"
                }
            },
            bdd: {
                bdd_bdd11y: {
                    desc: "前三位",
                    num: "前三位|1-11|all",
                    name: "前三位不定胆"
                }
            },
            dwd: {
                dwd_dwd11y: {
                    desc: "定位胆",
                    num: "第一位,第二位,第三位|1-11|all",
                    name: "定位胆"
                }
            },
            rxfs: {
                rxfs_1z1: {
                    desc: "一中一",
                    num: "选一中1|1-11|all",
                    name: "任选复式一中一"
                },
                rxfs_2z2: {
                    desc: "二中二",
                    num: "选二中2|1-11|all",
                    name: "任选复式二中二"
                },
                rxfs_3z3: {
                    desc: "三中三",
                    num: "选三中3|1-11|all",
                    name: "任选复式三中三"
                },
                rxfs_4z4: {
                    desc: "四中四",
                    num: "选四中4|1-11|all",
                    name: "任选复式四中四"
                },
                rxfs_5z5: {
                    desc: "五中五",
                    num: "选五中5|1-11|all",
                    name: "任选复式五中五"
                },
                rxfs_6z5: {
                    desc: "六中五",
                    num: "选六中5|1-11|all",
                    name: "任选复式六中五"
                },
                rxfs_7z5: {
                    desc: "七中五",
                    num: "选七中5|1-11|all",
                    name: "任选复式七中五"
                },
                rxfs_8z5: {
                    desc: "八中五",
                    num: "选八中5|1-11|all",
                    name: "任选复式八中五"
                }
            }
        }
    },
    SD11Y: {
        ltTab: {
            sm: "三码",
            em: "二码",
            bdd: "不定胆",
            dwd: "定位胆",
            rxfs: "任选复式"
        },
        ltMethod: {
            sm: {
                sm_zxfs: {
                    desc: "前三直选复式",
                    num: "第一位,第二位,第三位|1-11|all",
                    name: "前三直选复式"
                },
                sm_zuxfs: {
                    desc: "前三组选复式",
                    num: "前三组选|1-11|all",
                    name: "前三组选复式"
                }
            },
            em: {
                em_zxfs: {
                    desc: "前二直选复式",
                    num: "第一位,第二位|1-11|all",
                    name: "前二直选复式"
                },
                em_zuxfs: {
                    desc: "前二组选复式",
                    num: "前二组选|1-11|all",
                    name: "前二组选复式"
                }
            },
            bdd: {
                bdd_bdd11y: {
                    desc: "前三位",
                    num: "前三位|1-11|all",
                    name: "前三位不定胆"
                }
            },
            dwd: {
                dwd_dwd11y: {
                    desc: "定位胆",
                    num: "第一位,第二位,第三位|1-11|all",
                    name: "定位胆"
                }
            },
            rxfs: {
                rxfs_1z1: {
                    desc: "一中一",
                    num: "选一中1|1-11|all",
                    name: "任选复式一中一"
                },
                rxfs_2z2: {
                    desc: "二中二",
                    num: "选二中2|1-11|all",
                    name: "任选复式二中二"
                },
                rxfs_3z3: {
                    desc: "三中三",
                    num: "选三中3|1-11|all",
                    name: "任选复式三中三"
                },
                rxfs_4z4: {
                    desc: "四中四",
                    num: "选四中4|1-11|all",
                    name: "任选复式四中四"
                },
                rxfs_5z5: {
                    desc: "五中五",
                    num: "选五中5|1-11|all",
                    name: "任选复式五中五"
                },
                rxfs_6z5: {
                    desc: "六中五",
                    num: "选六中5|1-11|all",
                    name: "任选复式六中五"
                },
                rxfs_7z5: {
                    desc: "七中五",
                    num: "选七中5|1-11|all",
                    name: "任选复式七中五"
                },
                rxfs_8z5: {
                    desc: "八中五",
                    num: "选八中5|1-11|all",
                    name: "任选复式八中五"
                }
            }
        }
    },
    JX11Y: {
        ltTab: {
            sm: "三码",
            em: "二码",
            bdd: "不定胆",
            dwd: "定位胆",
            rxfs: "任选复式"
        },
        ltMethod: {
            sm: {
                sm_zxfs: {
                    desc: "前三直选复式",
                    num: "第一位,第二位,第三位|1-11|all",
                    name: "前三直选复式"
                },
                sm_zuxfs: {
                    desc: "前三组选复式",
                    num: "前三组选|1-11|all",
                    name: "前三组选复式"
                }
            },
            em: {
                em_zxfs: {
                    desc: "前二直选复式",
                    num: "第一位,第二位|1-11|all",
                    name: "前二直选复式"
                },
                em_zuxfs: {
                    desc: "前二组选复式",
                    num: "前二组选|1-11|all",
                    name: "前二组选复式"
                }
            },
            bdd: {
                bdd_bdd11y: {
                    desc: "前三位",
                    num: "前三位|1-11|all",
                    name: "前三位不定胆"
                }
            },
            dwd: {
                dwd_dwd11y: {
                    desc: "定位胆",
                    num: "第一位,第二位,第三位|1-11|all",
                    name: "定位胆"
                }
            },
            rxfs: {
                rxfs_1z1: {
                    desc: "一中一",
                    num: "选一中1|1-11|all",
                    name: "任选复式一中一"
                },
                rxfs_2z2: {
                    desc: "二中二",
                    num: "选二中2|1-11|all",
                    name: "任选复式二中二"
                },
                rxfs_3z3: {
                    desc: "三中三",
                    num: "选三中3|1-11|all",
                    name: "任选复式三中三"
                },
                rxfs_4z4: {
                    desc: "四中四",
                    num: "选四中4|1-11|all",
                    name: "任选复式四中四"
                },
                rxfs_5z5: {
                    desc: "五中五",
                    num: "选五中5|1-11|all",
                    name: "任选复式五中五"
                },
                rxfs_6z5: {
                    desc: "六中五",
                    num: "选六中5|1-11|all",
                    name: "任选复式六中五"
                },
                rxfs_7z5: {
                    desc: "七中五",
                    num: "选七中5|1-11|all",
                    name: "任选复式七中五"
                },
                rxfs_8z5: {
                    desc: "八中五",
                    num: "选八中5|1-11|all",
                    name: "任选复式八中五"
                }
            }
        }
    },
    "3DFC": {
        ltTab: {
            sm: "三码",
            em: "二码",
            dwd: "定位胆",
            bdd: "不定胆"
        },
        ltMethod: {
            sm: {
                zx_fs: {
                    desc: "复式",
                    num: "百位,十位,个位|0-9|all",
                    name: "三码直选复式"
                },
                zx_hz: {
                    desc: "和值",
                    num: "直选和值|0-27|",
                    name: "三码直选和值"
                },
                zux_z3: {
                    desc: "组三",
                    num: "组三|0-9|all",
                    name: "三码组选三"
                },
                zux_z6: {
                    desc: "组六",
                    num: "组六|0-9|all",
                    name: "三码组选六"
                },
                zux_hz: {
                    desc: "和值",
                    num: "组选和值|1-26|",
                    name: "三码组选和值"
                }
            },
            em: {
                zx_hfs: {
                    desc: "后二直选复式",
                    num: "十位,个位|0-9|all",
                    name: "后二直选复式"
                },
                zx_qfs: {
                    desc: "前二直选复式",
                    num: "百位,十位|0-9|all",
                    name: "前二直选复式"
                },
                zux_hfs: {
                    desc: "后二组选复式",
                    num: "组选|0-9|all",
                    name: "后二组选复式"
                },
                zux_qfs: {
                    desc: "前二组选复式",
                    num: "组选|0-9|all",
                    name: "前二组选复式"
                }
            },
            dwd: {
                dwd_dwd: {
                    desc: "定位胆",
                    num: "百位,十位,个位|0-9|all",
                    name: "定位胆"
                }
            },
            bdd: {
                bdd_bdd1: {
                    desc: "一码",
                    num: "不定胆|0-9|all",
                    name: "一码不定胆"
                },
                bdd_bdd2: {
                    desc: "二码",
                    num: "不定胆|0-9|all",
                    name: "二码不定胆"
                }
            }
        }
    },
    BJPK10: {
        ltTab: {
            cq1: "猜冠军",
            cq2: "猜前二",
            cq3: "猜前三",
            cq4: "猜前四",
            cq5: "猜前五",
            dwd: "定位胆",
            dx: "大小",
            hz: "和值",
            ds: "单双",
            lh: "龙虎"
        },
        ltMethod: {
            cq1: {
                cq1_cq1: {
                    desc: "猜冠军",
                    num: "冠军|1-10|all",
                    name: "猜冠军"
                }
            },
            cq2: {
                cq2_cq2: {
                    desc: "猜前二",
                    num: "冠军,第二名|1-10|all",
                    name: "猜前二"
                },
                cq2_ds: {
                    desc: "猜前二(单式)",
                    num: "冠军,第二名|1-10|all",
                    name: "猜前二(单式)"
                }
            },
            cq3: {
                cq3_cq3: {
                    desc: "猜前三",
                    num: "冠军,第二名,第三名|1-10|all",
                    name: "猜前三"
                },
                cq3_ds: {
                    desc: "猜前三(单式)",
                    num: "冠军,第二名,第三名|1-10|all",
                    name: "猜前三(单式)"
                }
            },
            cq4: {
                cq4_cq4: {
                    desc: "猜前四",
                    num: "冠军,第二名,第三名,第四名|1-10|all",
                    name: "猜前四"
                },
                cq4_ds: {
                    desc: "猜前四(单式)",
                    num: "冠军,第二名,第三名,第四名|1-10|all",
                    name: "猜前四(单式)"
                }
            },
            cq5: {
                cq5_cq5: {
                    desc: "猜前五",
                    num: "冠军,第二名,第三名,第四名,第五名|1-10|all",
                    name: "猜前五"
                },
                cq5_ds: {
                    desc: "猜前五(单式)",
                    num: "冠军,第二名,第三名,第四名,第五名|1-10|all",
                    name: "猜前五(单式)"
                }
            },
            dwd: {
                dwd_q5: {
                    desc: "前五定位胆",
                    num: "冠军,第二名,第三名,第四名,第五名|1-10|all",
                    name: "前五定位胆"
                },
                dwd_h5: {
                    desc: "后五定位胆",
                    num: "第六名,第七名,第八名,第九名,第十名|1-10|all",
                    name: "后五定位胆"
                }
            },
            dx: {
                dx_d1: {
                    desc: "冠军",
                    num: "冠军|0-1|two",
                    name: "大小冠军"
                },
                dx_d2: {
                    desc: "第二名",
                    num: "第二名|0-1|two",
                    name: "大小第二名"
                },
                dx_d3: {
                    desc: "第三名",
                    num: "第三名|0-1|two",
                    name: "大小第三名"
                },
                dx_d4: {
                    desc: "第四名",
                    num: "第四名|0-1|two",
                    name: "大小第四名"
                },
                dx_d5: {
                    desc: "第五名",
                    num: "第五名|0-1|two",
                    name: "大小第五名"
                },
                dx_q2: {
                    desc: "冠亚和值",
                    num: "冠亚和值|0-1|two",
                    name: "冠亚和值大小"
                }
            },
            hz: {
                hz_q2: {
                    desc: "冠亚和值",
                    num: "和值|3-19|",
                    name: "冠亚和值"
                },
                hz_q3: {
                    desc: "前三和值",
                    num: "和值|6-27|",
                    name: "前三和值"
                }
            },
            ds: {
                ds_d1: {
                    desc: "冠军",
                    num: "冠军|2-3|two",
                    name: "单双冠军"
                },
                ds_d2: {
                    desc: "第二名",
                    num: "第二名|2-3|two",
                    name: "单双第二名"
                },
                ds_d3: {
                    desc: "第三名",
                    num: "第三名|2-3|two",
                    name: "单双第三名"
                },
                ds_d4: {
                    desc: "第四名",
                    num: "第四名|2-3|two",
                    name: "单双第四名"
                },
                ds_d5: {
                    desc: "第五名",
                    num: "第五名|2-3|two",
                    name: "单双第五名"
                },
                ds_q2: {
                    desc: "冠亚和值",
                    num: "冠亚和值|2-3|two",
                    name: "冠亚和值单双"
                }
            },
            lh: {
                lh_1v10: {
                    desc: "1v10",
                    num: "1v10|4-5|two",
                    name: "龙虎1v10"
                },
                lh_2v9: {
                    desc: "2v9",
                    num: "2v9|4-5|two",
                    name: "龙虎2v9"
                },
                lh_3v8: {
                    desc: "3v8",
                    num: "3v8|4-5|two",
                    name: "龙虎3v8"
                },
                lh_4v7: {
                    desc: "4v7",
                    num: "4v7|4-5|two",
                    name: "龙虎4v7"
                },
                lh_5v6: {
                    desc: "5v6",
                    num: "5v6|4-5|two",
                    name: "龙虎5v6"
                }
            }
        }
    }
};