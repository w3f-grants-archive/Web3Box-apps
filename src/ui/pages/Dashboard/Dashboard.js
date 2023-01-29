import React, { useState,useEffect } from "react";
import './Dashboard.scss';
import { connect ,useDispatch, useSelector} from 'react-redux';
import { useNavigate,useLocation } from 'react-router-dom';
import Talisman from '@talismn/api'
import {parseTime,queryBalance,formatAddressByChain} from "../../../substrate/polkadot.js";
import {tokenPrice} from "../../../substrate/risk.js";
import {knownSubstrate} from '../../../substrate/network'
import { setAccount,setSeed,setAddress,setethAddress } from '../../store/action';
import { Button ,Select,Input,Modal,messag,Card} from 'antd';
import dashboard_img from '../../images/dashboard.png';
import avatar_img from '../../images/avatar.png';
import icon_1_img from '../../images/icon_1.png';
import dot_img from '../../images/dot.png';
import ksm_img from '../../images/ksm.png';
import aca_img from '../../images/aca.png';
import glmr_img from '../../images/glmr.png';
import astr_img from '../../images/astr.png';
import pha_img from '../../images/pha.png';
import lit_img from '../../images/lit.png';
import icon_btc_img from '../../images/icon_btc.png';
import icon_eth_img from '../../images/icon_eth.png';
import icon_fil_img from '../../images/icon_fil.png';
import recent_trans_img from '../../images/recent_trans.png';
import btn_more_img from  '../../images/btn_more.png';
import market_head_img from  '../../images/market_head.png';

import ReactEcharts from 'echarts-for-react';
const { Option } = Select;
const { TransferService }  = require("../../store/transfer");
function Dashboard(props) {
    const useLocations= useLocation()
    const { account , address ,seed,setSeed,setAddress,ethAddress} = props;
    const Navigate = useNavigate();

    const [totalToken, setTotalToken] = useState(0);
    const [totalUsdt, setTotalUsdt] = useState(0);


    const [inputToken, setInputToken] = useState(0);
    const [inputPrice, setInputPrice] = useState(0);
    const [outToken, setOutToken] = useState(0);
    const [outPrice, setOutPrice] = useState(0);

    const [dotUsdt, setDotUsdt] = useState(0);
    const [ksmUsdt, setKsmUsdt] = useState(0);
    const [acaUsdt, setAcaUsdt] = useState(0);
    const [glmrUsdt, setglmrUsdt] = useState(0);
    const [astrUsdt, setastrUsdt] = useState(0);
    const [phaUsdt, setphaUsdt] = useState(0);
    const [litUsdt, setlitUsdt] = useState(0);
    const [data, setData] = useState([]);
    const [record, setRecord] = useState([]);
    const [tokenStroe, setTokenStroe] = useState({});
    const [usdtsStroe, setUsdtsStroe] = useState({});

    const decimals = {
        "DOT":10000000000,
        "KSM":1000000000000,
        "ACA":1000000000000, 
        "GLMR":1000000000000000000,
        "ASTR":1000000000000000000,
        "PHA":1000000000000000000,
        "LIT":1000000000000000000
    };

    let tokens = {
        "DOT":0,
        "KSM":0,
        "ACA":0, 
        "GLMR":0,
        "ASTR":0,
        "PHA":0,
        "LIT":0
    };

    let usdts = {
        "DOT":0,
        "KSM":0,
        "ACA":0, 
        "GLMR":0,
        "ASTR":0,
        "PHA":0,
        "LIT":0
    };

    const moreNavigate = () => {
        Navigate('/WalletHome');
    }

    useEffect(  ()=>{
        if( typeof account == 'undefined' || account == ''){
            Navigate('/WalletConfirm');
        }
        getBalance();     
    },[address])


    const getOption = (data) =>{
        return {
            tooltip: {
                trigger: 'item',

              },
              legend: {
                orient: 'vertical',
                left: 'left'
              },
              series: [
                {
                  name: '',
                  type: 'pie',
                  radius: '40%',
                  label:{
                    normal :{
                        show:true,
                        position:'inside',
                        formatter:'{d}%'
                    }
                  },
                  data:data,
                //   data: [
                //     { value: 1048, name: 'Search Engine' },
                //     { value: 735, name: 'Direct' },
                //     { value: 580, name: 'Email' },
                //     { value: 484, name: 'Union Ads' },
                //     { value: 300, name: 'Video Ads' }
                //   ],
                  left: 100,
                  top:-80,
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
        }
    }
   
   

    const handleChange = async (value) => {
        let r = formatAddressByChain(account,value);
        if(value == 1284){
            setAddress(ethAddress);
        }else{
            setAddress(r);
        } 
        setSeed(value);
        knownSubstrate.map(item => {
          if(item.prefix === value * 1){ 
            setTotalToken( tokenStroe[item.symbols[0]]);
            const t = ( tokenStroe[item.symbols[0]]  * 1 ) * ( usdtsStroe[item.symbols[0]] * 1) ;
            setTotalUsdt(t.toFixed(2));
          }
        })

    }
  
    const getBalance = async()=>{
        setSeed(0) ;
        if( typeof account == 'undefined' || account == ''){
           return;
        }
        tokenPrice().then( async(item) => {
            setDotUsdt(item.polkadot.usd.toFixed(2));
            setKsmUsdt(item.kusama.usd.toFixed(2));
            setAcaUsdt(item.acala.usd.toFixed(2));
            setglmrUsdt(item.moonbeam.usd.toFixed(2));
            setastrUsdt(item.astar.usd.toFixed(2));
            setphaUsdt(item.pha.usd.toFixed(2));
            setlitUsdt(item.litentry.usd.toFixed(2));

            usdts['DOT'] = item.polkadot.usd.toFixed(2);
            usdts['KSM'] = item.kusama.usd.toFixed(2);
            usdts['ACA'] = item.acala.usd.toFixed(2);
            usdts['GLMR'] = item.moonbeam.usd.toFixed(2);
            usdts['ASTR'] = item.astar.usd.toFixed(2);
            usdts['PHA'] = item.pha.usd.toFixed(2);
            usdts['LIT'] = item.litentry.usd.toFixed(2);

            setUsdtsStroe(usdts);

            await Talisman.connect({ chains: [0, 2, 10,1284,5] }).then(r => {
          
            });
            let newData = [];
            await Talisman.balances([account]).then(obj => {
                obj.map((item) => {
                    const _free =  (item.free / decimals[item.token] * 1).toFixed(2) ;
                    tokens[item.token] = _free * 1;
                    newData.push({value:_free,name:item.token})

                })
                setData(newData);
            })
            setTokenStroe(tokens);
           
            let r = formatAddressByChain(account,0);
            setAddress(r);
            setTotalToken( tokens['DOT']);
            const t = ( tokens['DOT']  * 1 ) * ( usdts['DOT'] * 1) ;
            setTotalUsdt(t.toFixed(2));

            getTransList();
        });
    }

    const getTransList = async() =>{
        var indexdb = new TransferService();
        var query = indexdb.getTransfers(address).then(res=>{
            let outTotal = 0;
            let outPrice = 0;
            res.map((item) =>{
                outTotal += item.balance;
                outPrice += item.balance * usdtsStroe[item.symbols] * 1
            })
            setOutToken(outTotal);
            setOutPrice(outPrice);

            setInputToken( totalToken - outTotal < 0?0: (totalToken - outTotal).toFixed(2));
            setInputPrice(totalUsdt - outPrice < 0?0:(totalUsdt - outPrice).toFixed(2));
            const newData = res.slice(0,5);
            setRecord(newData)
        });
    }
    return (
        <div className={account !== '' ? "dashboard": 'hide'} >
            <div className='top_'>
                <img src={dashboard_img} />
                <div>
                    <img src={avatar_img} />
                    <span>{typeof address != 'undefined' ?address.slice(0, 4):''} </span>
                    <span> *****</span>
                    <span>{typeof address != 'undefined' ?address.slice(address.length - 4, address.length):''}</span>
                </div>
            </div>

            <div className='fil_balance'>
                <div className="fil_balanc_bg">
                        <table>
                            <tr>
                                <td className="td_img"><img src={icon_1_img}></img> </td>
                                <td className="td_number">Balance</td>
                                <td className="td_center">
                                <Select className='select_main' defaultValue={0} style={{ width: 200 }} onChange={handleChange}>
                                {
                                    knownSubstrate.map(item=>{
                                    return <Option value={item.prefix} key={item.prefix}>{item.displayName}</Option>
                                    })
                                }
                                </Select>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="3" className="td_number td_number_padding" >{totalToken}</td>
                            </tr>

                            <tr>
                                <td colSpan="3" className="td_money_numer td_number_padding">$ {totalUsdt}</td>
                            </tr>
                        </table>

                        <ul>
                            <li>
                                <span>Total Input</span>
                                <span>Total Output</span>
                            </li>
                            <li className="token">
                                <span>{inputToken}</span>
                                <span>{outToken}</span>
                            </li>
                            <li>
                                <span>$ {inputPrice}</span>
                                <span>$ {outPrice}</span>
                            </li>
                        </ul>
                </div>

                <div className="fil_recent_trans">
                        <div className='head' >
                            <p>Polkadot Assets Pie Chart</p>
                        </div>
                        {/* <div className="chart">
                          
                        
                        </div> */}
                          <ReactEcharts option={getOption(data)} />
                </div>

                <div className="fil_recent_trans">

                        <div className='head'   >
                            <p>Recent Transactions</p>
                            <img src={btn_more_img} onClick={moreNavigate} className="btn_more"/>
                        </div>
                        <div>
                            <table>
                                <tr>
                                    <td className="time">Time</td>
                                    <td className="center">Token</td>
                                    <td className="center">Amount</td>
                                </tr>

                                {
                                record.map((item,index)=>{
                                
                                return    <tr key={index}>
                                <td>{new Date(parseInt((item.createTime).getTime())).toLocaleString()}</td>
                                <td className="center">{item.symbols}</td>
                                <td className="center">{item.balance}</td>
                            </tr>
                           
                         })
                         }

                            </table>
                        </div>
                        
                </div>
            </div>


            <div className="mark">
                <div className='top_'>
                    <img src={market_head_img} />
                </div>

                <ul>
                    <li>
                        <table>
                            <tr>
                                <td> <img src={dot_img}/></td>
                                <td className="right"> <span className="icon_btn">DOT</span></td>
                            </tr>
                            <tr>
                                <td colSpan="3"> 
                                <p>$ {dotUsdt} </p>
                                </td>
                            </tr>
                        </table>
                    </li>
                    <li>
                    <table>
                            <tr>
                                <td> <img src={ksm_img}/></td>
                                <td className="right"><span className="icon_btn">KSM</span></td>
                            </tr>
                            <tr>
                                <td colSpan="3"> 
                                <p>$ {ksmUsdt} </p>
                                </td>
                            </tr>
                        </table>
                    </li>
                    <li>
                        <table>
                            <tr>
                                <td> <img src={aca_img}/></td>
                                <td className="right"> <span className="icon_btn">ACA</span></td>
                            </tr>
                            <tr>
                                <td colSpan="3"> 
                                <p>$ {acaUsdt} </p>
                                </td>
                            </tr>
                        </table>
                    </li>
                    <li>
                        <table>
                            <tr>
                                <td> <img src={glmr_img}/></td>
                                <td className="right"> <span className="icon_btn">GLMR</span></td>
                            </tr>
                            <tr>
                                <td colSpan="3"> 
                                <p>$ {glmrUsdt} </p>
                                </td>
                            </tr>
                        </table>
                    </li>
                    <li>
                        <table>
                            <tr>
                                <td> <img src={astr_img}/></td>
                                <td className="right"> <span className="icon_btn">ASTR</span></td>
                            </tr>
                            <tr>
                                <td colSpan="3"> 
                                <p>$ {astrUsdt} </p>
                                </td>
                            </tr>
                        </table>
                    </li>
                    <li>
                        <table>
                            <tr>
                                <td> <img src={pha_img}/></td>
                                <td className="right"> <span className="icon_btn">PHA</span></td>
                            </tr>
                            <tr>
                                <td colSpan="3"> 
                                <p>$ {phaUsdt} </p>
                                </td>
                            </tr>
                        </table>
                    </li>
                    <li>
                        <table>
                            <tr>
                                <td> <img src={lit_img}/></td>
                                <td className="right"> <span className="icon_btn">LIT</span></td>
                            </tr>
                            <tr>
                                <td colSpan="3"> 
                                <p>$ {litUsdt} </p>
                                </td>
                            </tr>
                        </table>
                    </li>
                </ul>
            </div>
          

            <div className="coming">
                <ul>
                    <li className="coming_1"></li>
                    <li className="coming_2"></li>
                </ul>
            </div>

            </div>
      
    )
}
const mapDispatchToProps = (dispatch) => {
    return {
        setAccount:(account) => dispatch(setAccount(account)),
        setAddress:(address) => dispatch(setAddress(address)),
        setethAddress:(ethAddress) => dispatch(setethAddress(ethAddress)),
        setSeed:(seed) => dispatch(setSeed(seed)),
    }
}

const mapStateToProps = (state) => {
    return {
        account: state.account,
        address:state.address,
        ethAddress:state.ethAddress,
        seed:state.seed
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(Dashboard)
