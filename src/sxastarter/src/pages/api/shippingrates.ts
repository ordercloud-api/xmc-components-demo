import { ShipEstimatePayload } from 'ordercloud-javascript-sdk';
import { withOcWebhookAuth } from '@ordercloud/catalyst';
import { NextApiRequest, NextApiResponse } from 'next';

// withOCWebhookAuth needs the raw body in order to validate the payload is coming from ordercloud
export const config = {
  api: {
    bodyParser: false,
  },
};

const routeHandler = (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * OrderCloud API will pass the OrderWorksheet to the /shippingrates middleware
   * within the request body. Use this information to calculate shipment estimate groups.
   * In this example we are not using a third party shipping service. It assumes
   * all LineItems are in a single ShipEstimate, and the 3 different shipping options
   * are provided at a fixed rate.
   * */
  const event = req.body as ShipEstimatePayload;

  res.status(200).send({
    ShipEstimates: [
      {
        ID: 'test',
        ShipEstimateItems: event.OrderWorksheet.LineItems.map((li) => ({
          LineItemID: li.ID,
          Quantity: li.Quantity,
        })),
        ShipMethods: [
          {
            ID: '1day',
            Name: 'Next Day Shipping',
            Cost: 50,
            EstimatedTransitDays: 1,
          },
          {
            ID: '2day',
            Name: 'Two Day Shipping',
            Cost: 25,
            EstimatedTransitDays: 2,
          },
          {
            ID: 'standard',
            Name: 'Standard Shipping',
            Cost: 12,
            EstimatedTransitDays: 5,
          },
        ],
      },
    ],
  });
};

export default withOcWebhookAuth(routeHandler);
