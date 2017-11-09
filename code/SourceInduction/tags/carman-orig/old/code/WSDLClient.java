package invocation.wrappers;

import javax.xml.namespace.QName;
import javax.xml.rpc.Call;
import javax.xml.rpc.ParameterMode;
import javax.xml.rpc.Service;
import javax.xml.rpc.ServiceFactory;
import javax.xml.rpc.encoding.XMLType;

import java.util.ArrayList;

import relational.Table;
import invocation.Client;

public class WSDLClient extends Client {

	@Override
	public Table invoke(String[] endpoint, ArrayList<String> inputTuple) {
		// TODO Auto-generated method stub
		return null;
	}

        
	public Table invoke(String endpoint, ArrayList<String> inputTuple ) {
		try {
            
			QName serviceName = new QName("http://www.xmethods.net/sd/BNQuoteService.wsdl","BNQuoteService");
            
			Service service = ServiceFactory.newInstance().createService(serviceName);
            
            Call call = service.createCall();

            QName operationName = new QName("urn:xmethods-BNPriceCheck","getPrice");
            call.setOperationName(operationName);

            call.addParameter(
                    "isbn",             // parameter name
                    XMLType.XSD_STRING, // parameter XML type QName
                    String.class,       // parameter Java type class
                    ParameterMode.IN);  // parameter mode

            // The return
            call.setReturnType(XMLType.XSD_FLOAT);
            // The operation is an RPC-style operation.
            call.setProperty(
                    Call.OPERATION_STYLE_PROPERTY,
                    "rpc");
            
            // The target endpoint
            call.setTargetEndpointAddress("http://services.xmethods.net:80/soap/servlet/rpcrouter");
           
            // Invoke the operation
            Object[] actualArgs = {"0672324229"};
            Float price = (Float) call.invoke(actualArgs);
            System.out.println("price = " + price);
		
		}
        catch (Throwable t) {
            t.printStackTrace();
        }
        
        return null;
	}
	
}