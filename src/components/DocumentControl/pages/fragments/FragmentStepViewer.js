import { Form, Steps } from "antd";
import React, { Children } from "react";
import { formatDate } from "../../../../core/functions";
import { getDiffHours } from "./../../../../core/functions";
import { moment } from "moment";
const { Step } = Steps;

/**
 * Фрагмент antd дающую возможность просматривать состояние движений документов
 * @param props.signatures
 * @param props.stepsDirection Направление "шагов" в движение документов
 * @param props.step Этап("шаг") движение документов
 * @param props.routesList Массив "шагов" движений документов
 */

export const FragmentStepViewer = (props) => {
  return (
    <Form.Item
      className="font-form-header"
      name="signatures"
      label="Подписи"
      labelCol={{ span: 24 }}
    >
      {props?.signatures.map((item, index) => {
        //remove commentsList
        //TODO: Если у нас был возврат назад, то есть подписи, которые не должны быть. В идеале их нужно удалить, когда мы возвращаемся.
        //Пока что просто выводим все до текущей подписи
        return props?.step > index ? (
          <>
            <div className="signature-view-wrap">
              <span className="signature-view-position">{item.position}</span>
              <span className="signature-view-username">{item.fio}</span>
              <span className="signature-view-date">
                {formatDate(item.date_signature)}
              </span>
            </div>
          </>
        ) : (
          ""
        );
      })}
      <Steps
        labelPlacement="vertical"
        size="small"
        direction={props?.stepsDirection.current}
        responsive={true}
        current={props?.step}
        className="steps-form-update"
      >
        {props?.routesList.map((item) => {
          return <Step title={item.positionName} />;
        })}
      </Steps>
    </Form.Item>
  );
};

FragmentStepViewer.defaultProps = { stepsDirection: "vertical" };

/**
 * Фрагмент antd дающую возможность просматривать состояние движений документов и изменять замещающих
 * @param props.signatures
 * @param props.setVisible
 * @param props.stepCount
 * @param props.routeData
 * @param props.date_created
 */

export const FragmentStepViewerReplacementDialog = (props) => {
  const {
    signatures,
    setVisible,
    stepCount,
    routeData,
    date_created,
    step,
    children,
  } = props;
  return (
    <Form.Item
      className="font-form-header"
      name="signatures"
      label="Подписи"
      labelCol={{ span: 24 }}
    >
      {signatures.map((item) => {
        //remove commentsList
        return (
          <>
            <div className="signature-view-wrap">
              <span className="signature-view-position">{item.position}</span>
              <span className="signature-view-username">{item.fio}</span>
              <span className="signature-view-date">
                {formatDate(item.date_signature)}
              </span>
            </div>
          </>
        );
      })}

      {children}

      <Steps
        labelPlacement="vertical"
        size="small"
        current={stepCount.step - 1}
        className="steps-form-update"
      >
        {routeData.map((item, i) => {
          return (
            <>
              <Step
                title={item.positionName}
                onClick={() => {
                  //console.log("step click", item);
                  if (step == i + 1) {
                    //console.log("setVisible(true);");
                    setVisible(true);
                  }
                }}
                subTitle={
                  (i == stepCount.step - 1 && signatures?.length > 0) ||
                  stepCount.step == 1
                    ? (() => {
                        if (stepCount.step == 1 && i == 0) {
                          let tmpD = getDiffHours(
                            new Date(date_created),
                            new Date()
                          );
                          return tmpD?.toString();
                        }
                        if (i !== 0 && signatures[i - 1]?.date_signature) {
                          let tmpD = getDiffHours(
                            new Date(
                              signatures[signatures.length - 1].date_signature
                            ),
                            new Date()
                          );
                          return tmpD?.toString();
                        }
                      })()
                    : null
                }
              />
            </>
          );
        })}
      </Steps>
    </Form.Item>
  );
};

/**
 * Фрагмент antd дающую возможность просматривать состояние движений документов без цепочки последовательности
 * @param props.signatures
 */

export const FragmentStepViewerRaw = (props) => {
  return (
    <Form.Item
      className="font-form-header"
      name="signatures"
      label="Подписи"
      labelCol={{ span: 24 }}
    >
      {props?.signatures.map((item) => {
        //remove commentsList
        return (
          <>
            <div className="signature-view-wrap">
              <span className="signature-view-position">{item.position}</span>
              <span className="signature-view-username">{item.fio}</span>
              <span className="signature-view-date">
                {formatDate(item.date_signature)}
              </span>
            </div>
          </>
        );
      })}
    </Form.Item>
  );
};
